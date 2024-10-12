import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import AIDashboardPage from './pages/AIDashboardPage';
import './App.css'; 

const App = () => {
  return (
    <Router>
      <div style={styles.appContainer}>
        <nav style={styles.navbar}>
          <h2 style={styles.logo}>InsightSync</h2>
          <ul style={styles.navList}>
            <li>
              <Link to="/" style={styles.navLink}>Dashboard</Link>
            </li>
            <li>
              <Link to="/ai-insights" style={styles.navLink}>InsightAI</Link>
            </li>
          </ul>
        </nav>
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/ai-insights" element={<AIDashboardPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

// css
const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  navbar: {
    background: 'linear-gradient(135deg, rgb(78 51 108), rgb(96 118 156))', 
    color: '#fff',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', 
  },
  logo: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    color: '#ffffff', 
    cursor: 'pointer',
  },
  navList: {
    listStyleType: 'none',
    padding: 0,
    display: 'flex',
    gap: '15px', 
  },
  navLink: {
    position: 'relative',
    color: '#ffffff', 
    textDecoration: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: '500',
    borderRadius: '30px', 
    transition: 'color 0.3s ease', 
    overflow: 'hidden', 
  },
  content: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f0f2f5',
    overflowY: 'auto',
  },
};



export default App;
