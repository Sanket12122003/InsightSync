import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const SalesChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="loading">Loading...</div>;
    }

    const chartData = {
        labels: data.map(point => point.ds.substring(0, 10)),
        datasets: [
            {
                label: 'Predicted Sales',
                data: data.map(point => point.yhat),
                fill: false,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: '#42a5f5',
                borderWidth: 3,
                tension: 0.3,  // Adds smooth curves
                pointBackgroundColor: '#1e88e5',
                pointBorderColor: '#fff',
                pointHoverRadius: 8,
                pointHoverBorderColor: '#1e88e5',
            },
        ],
    };

    // Calculate average predicted sales for marketing strategy suggestion
    const predictedSales = data.map(point => point.yhat);
    const totalPredictedSales = predictedSales.reduce((acc, val) => acc + val, 0);
    const averagePredictedSales = totalPredictedSales / predictedSales.length;

    // Determine marketing strategy based on predicted sales
    let marketingStrategy = '';
    if (averagePredictedSales < 1000) {
        marketingStrategy = 'Boost social media ads and provide discounts.';
    } else if (averagePredictedSales >= 1000 && averagePredictedSales < 5000) {
        marketingStrategy = 'Use email marketing campaigns for targeted outreach.';
    } else {
        marketingStrategy = 'Leverage influencer partnerships and large-scale promotions.';
    }

    // Inline styles for the chart container and strategy suggestion
    const styles = {
        chartContainer: {
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            margin: '20px 0',
        },
        chartBox: {
            height: '40vh', 
            position: 'relative',
            marginBottom: '20px',
        },
        strategySuggestion: {
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.3s, box-shadow 0.3s',
        },
        strategyTitle: {
            fontSize: '20px',
            color: '#333',
            marginBottom: '10px',
        },
        strategyText: {
            fontSize: '16px',
            color: '#555',
        },
    };

    return (
        <div style={styles.chartContainer}>
            <h2 className="chart-title">Sales Prediction for the Next 30 Days</h2>
            <div style={styles.chartBox}>
                <Line data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
            <div style={styles.strategySuggestion}>
                <h3 style={styles.strategyTitle}>Recommended Marketing Strategy</h3>
                <p style={styles.strategyText}>{marketingStrategy}</p>
            </div>
        </div>
    );
};

export default SalesChart;
