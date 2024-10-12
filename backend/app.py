from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO
from prophet import Prophet
import pandas as pd
import os
from langchain_groq import ChatGroq
from langchain_community.document_loaders import WebBaseLoader
from langchain.embeddings import OllamaEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS
from dotenv import load_dotenv

# Load environment variable
load_dotenv()

app = Flask(__name__)
CORS(app)  
socketio = SocketIO(app)

# Path to Excel sales data
excel_file_path = 'Adidas.xlsx'

# Load sales data from Excel
def load_and_prepare_sales_data():
    try:
        df_sales = pd.read_excel(excel_file_path, sheet_name='Sales')
        df_aggregated_sales = df_sales.groupby('InvoiceDate')['TotalSales'].sum().reset_index()
        df_aggregated_sales.columns = ['ds', 'y']
        df_aggregated_sales['ds'] = pd.to_datetime(df_aggregated_sales['ds'])
        return df_aggregated_sales
    except Exception as e:
        print("Error loading sales data:", e)
        return pd.DataFrame()

# Function to make predictions using Prophet
def predict_sales(df_sales):
    model = Prophet()
    model.fit(df_sales)
    future = model.make_future_dataframe(periods=30)  
    forecast = model.predict(future)
    return forecast[['ds', 'yhat']].tail(30)

# API route to get initial sales predictions
@app.route('/predict_sales', methods=['GET'])
def get_sales_predictions():
    df_sales = load_and_prepare_sales_data()
    if df_sales.empty:
        return jsonify({'error': 'Failed to load sales data'}), 500
    predictions = predict_sales(df_sales)
    return jsonify(predictions.to_dict(orient="records"))

# API route for actual sales data
@app.route('/actual_sales', methods=['GET'])
def get_actual_sales():
    try:
        df_sales = pd.read_excel(excel_file_path, sheet_name='Sales')
        df_sales['InvoiceDate'] = pd.to_datetime(df_sales['InvoiceDate'])
        actual_sales = df_sales.groupby('InvoiceDate')['TotalSales'].sum().reset_index()
        actual_sales.columns = ['ds', 'y']
        return jsonify(actual_sales.to_dict(orient="records"))
    except Exception as e:
        print("Error loading actual sales data:", e)
        return jsonify({'error': 'Failed to load actual sales data'}), 500

# Load the Groq API key for LangChain
groq_api_key = os.getenv('GROQ_API_KEY')

# Initialize embeddings and vector store
def initialize_vector_store():
    embeddings = OllamaEmbeddings()
    loader = WebBaseLoader("https://everfi.com/blog/financial-education/top-10-most-effective-marketing-strategies-for-financial-services/")
    docs = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    final_documents = text_splitter.split_documents(docs[:50])
    vectors = FAISS.from_documents(final_documents, embeddings)
    return vectors

# Initialize vector store
vector_store = initialize_vector_store()

# Initialize LLM with API key and model
llm = ChatGroq(groq_api_key=groq_api_key, model_name="mixtral-8x7b-32768")

#  prompt template 
prompt_template = ChatPromptTemplate.from_template(
    """
    Answer the question based on the provided context only. Please provide the response in a structured, conversational format, like ChatGPT. Use markdown formatting to organize the answer.

    <context>
    {context}
    </context>

    Question: {input}

    Answer the question with:
    - Point 1: **Explanation**
    - Point 2: **Explanation**
    - Point 3: **Explanation**

    Provide additional detail where necessary.
    """
)

# Create retrieval chain
document_chain = create_stuff_documents_chain(llm, prompt_template)
retriever = vector_store.as_retriever()
retrieval_chain = create_retrieval_chain(retriever, document_chain)

# API route to analyze business data 
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    query = data.get('query')
    try:
        # Invoke the retrieval chain 
        response = retrieval_chain.invoke({"input": query})
        return jsonify({
            'answer': response['answer'],
            'format': 'markdown'  
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# API route to submit feedback
@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.json
    query = data.get('query')
    feedback_score = data.get('feedback_score')
    response_text = data.get('response_text')

    
    with open('feedback_log.csv', 'a') as f:
        f.write(f"{query},{response_text},{feedback_score}\n")
    
    return jsonify({'status': 'Feedback received'})

# API route for document similarity search
@app.route('/similarity', methods=['POST'])
def similarity():
    data = request.json
    query = data.get('query')
    try:
        response = retrieval_chain.invoke({"input": query})
        related_docs = [doc.page_content for doc in response["context"]]
        return jsonify({
            'related_documents': related_docs,
            'format': 'markdown'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500



# Run the Flask app with SocketIO
if __name__ == '__main__':
    socketio.run(app, debug=True)
