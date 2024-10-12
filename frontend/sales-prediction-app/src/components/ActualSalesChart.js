import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ActualSalesChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="loading">Loading...</div>;
    }

    const chartData = {
        labels: data.map(point => point.ds.substring(0, 10)),
        datasets: [
            {
                label: 'Actual Sales',
                data: data.map(point => point.y),
                fill: false,
                backgroundColor: 'rgba(255,99,132,1)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 2,
                tension: 0.3,  
                pointBackgroundColor: '#ff6384',
                pointBorderColor: '#fff',
                pointHoverRadius: 8,
                pointHoverBorderColor: '#ff6384',
            },
        ],
    };

    // Inline styles for the chart container
    const styles = {
        chartContainer: {
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            margin: '20px 0',
            transition: 'transform 0.3s, box-shadow 0.3s',
            animation: 'fadeIn 0.5s ease-in-out', 
        },
        chartBox: {
            height: '40vh', 
            position: 'relative',
            marginBottom: '20px',
        },
        chartTitle: {
            fontSize: '24px',
            color: '#333',
            marginBottom: '15px',
            textAlign: 'center',
        },
    };

    return (
        <div style={styles.chartContainer}>
            <h2 style={styles.chartTitle}>Actual Sales Over Time</h2>
            <div style={styles.chartBox}>
                <Line data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
        </div>
    );
};

export default ActualSalesChart;
