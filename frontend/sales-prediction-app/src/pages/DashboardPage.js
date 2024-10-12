import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SalesChart from '../components/SalesChart';
import ActualSalesChart from '../components/ActualSalesChart';

const DashboardPage = () => {
    const [predictions, setPredictions] = useState([]);
    const [actualSales, setActualSales] = useState([]);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/predict_sales');
                setPredictions(response.data);
            } catch (error) {
                console.error('Error fetching predictions:', error);
            }
        };

        const fetchActualSales = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/actual_sales');
                setActualSales(response.data);
            } catch (error) {
                console.error('Error fetching actual sales:', error);
            }
        };

        fetchPredictions();
        fetchActualSales();
    }, []);

    return (
        <div className="dashboard-container" style={styles.dashboardContainer}>
            <h1 className="dashboard-title" style={styles.title}>Sales Dashboard</h1>
            <div className="charts-container" style={styles.chartsContainer}>
                <div className="chart-box" style={styles.chartBox}>
                    <SalesChart data={predictions} />
                </div>
                <div className="chart-box" style={styles.chartBox}>
                    <ActualSalesChart data={actualSales} />
                </div>
            </div>
        </div>
    );
};

// Inline styles for DashboardPage
const styles = {
    dashboardContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f4f7fa',
        padding: '0px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '2.5rem',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center',
    },
    chartsContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        height: '85vh',
    },
    chartBox: {
        flex: 1,
        margin: '0 20px',
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
};

export default DashboardPage;
