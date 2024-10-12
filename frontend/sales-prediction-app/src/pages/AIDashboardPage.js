import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const AIDashboardPage = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null); 

  
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: 'smooth', 
      });
    }
  }, [conversation]);

  const handleSubmit = async () => {
    if (inputQuery.trim() === '') return;

    
    const userMessage = { sender: 'user', text: inputQuery };
    setConversation((prevConversation) => [...prevConversation, userMessage]);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/analyze', { query: inputQuery });

      const botResponse = {
        sender: 'bot',
        text: response.data.answer || 'No relevant data found.',
        relevanceScore: response.data.relevance_score || null,
      };
      setConversation((prevConversation) => [...prevConversation, botResponse]);
    } catch (error) {
      const botResponse = { sender: 'bot', text: 'Oops! Something went wrong. Please try again.' };
      setConversation((prevConversation) => [...prevConversation, botResponse]);
      console.error('Error:', error);
    }
    setLoading(false);
    setInputQuery('');
  };

  const submitFeedback = async (feedbackScore, responseText, query) => {
    try {
      await axios.post('http://localhost:5000/feedback', {
        query,
        feedback_score: feedbackScore,
        response_text: responseText,
      });
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="container mt-5" style={styles.container}>
      <h2 className="text-center mb-4" style={styles.header}>
        LLM RAG Powered Business Analyst ChatBot
      </h2>
      <div className="card p-4 shadow" style={styles.card}>
        {/* Chat Box */}
        <div className="chat-box mt-3" style={styles.chatBox} ref={chatBoxRef}>
          {conversation.map((message, index) => (
            <div key={index}>
              <div
                className={`d-flex mb-2 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  className={`p-3 rounded ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                  style={message.sender === 'user' ? styles.userMessage : styles.botMessage}
                >
                  {message.text}
                  {message.relevanceScore && (
                    <div style={styles.relevanceScore}>
                      Relevance Score: {message.relevanceScore.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>

              {/* Feedback Section (inline with bot messages) */}
              {message.sender === 'bot' && (
                <div className="d-flex justify-content-center mb-2" style={styles.feedbackSection}>
                  <span style={styles.feedbackText}>Rate this response: </span>
                  <button
                    className="btn btn-sm btn-outline-success ml-2"
                    onClick={() => submitFeedback(1, message.text, inputQuery)}
                    style={styles.feedbackButton}
                  >
                    👍
                  </button>
                  <button
                    className="btn btn-sm btn-outline-warning ml-2"
                    onClick={() => submitFeedback(2, message.text, inputQuery)}
                    style={styles.feedbackButton}
                  >
                    👌
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger ml-2"
                    onClick={() => submitFeedback(3, message.text, inputQuery)}
                    style={styles.feedbackButton}
                  >
                    👎
                  </button>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="d-flex justify-content-start mb-2">
              <div className="p-2 rounded bg-warning text-dark" style={styles.loadingMessage}>
                Analyzing...
              </div>
            </div>
          )}
        </div>

        {/* Input Field and Send Button */}
        <div className="input-group mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your query..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={styles.inputField}
          />
          <div className="input-group-append">
            <button className="btn btn-primary" onClick={handleSubmit} style={styles.sendButton}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inline styles for the chatbot UI
const styles = {
  container: {
    maxWidth: '750px',
    backgroundColor: '#f0f2f5', 
    borderRadius: '15px',
    
  },
  header: {
    color: '#333',
    fontSize: '1.8rem',
  },
  card: {
    borderRadius: '20px',
    background: '#ffffff',
  },
  chatBox: {
    height: '350px',
    overflowY: 'auto', 
    borderRadius: '15px',
    padding: '15px',
    backgroundColor: '#e9ecef',
    border: '1px solid #dee2e6',
    position: 'relative',
    scrollbarWidth: 'none', 
  },
  userMessage: {
    maxWidth: '80%',
    wordWrap: 'break-word',
    borderRadius: '15px',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px',
    margin: '5px',
  },
  botMessage: {
    maxWidth: '80%',
    wordWrap: 'break-word',
    borderRadius: '15px',
    backgroundColor: '#e9ecef',
    color: '#333',
    padding: '10px',
    margin: '5px',
  },
  loadingMessage: {
    maxWidth: '80%',
    wordWrap: 'break-word',
    borderRadius: '15px',
    backgroundColor: '#ffc107',
    color: '#333',
    padding: '10px',
    margin: '5px',
  },
  relevanceScore: {
    fontSize: '0.8rem',
    color: '#555',
    marginTop: '5px',
  },
  inputField: {
    borderRadius: '20px',
    padding: '10px',
    fontSize: '1rem',
  },
  sendButton: {
    borderRadius: '20px',
    padding: '10px 20px',
    marginLeft: '5px',
  },
  feedbackSection: {
    marginTop: '-10px',
    alignItems: 'center', 
  },
  feedbackText: {
    fontWeight: 'bold', 
    marginRight: '10px', 
  },
  feedbackButton: {
    fontSize: '0.8rem',
    padding: '2px 5px',
    borderRadius: '20px',
  },
};

//  global CSS to hide scrollbar for webkit browsers
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  .chat-box::-webkit-scrollbar {
    display: none; /* Hide scrollbar */
  }
`, styleSheet.cssRules.length);

export default AIDashboardPage;
