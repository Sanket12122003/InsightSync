import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import { io } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';


const socket = io('http://127.0.0.1:5000', {
    transports: ['websocket', 'polling'], //  WebSocket and Polling
    withCredentials: true,  //  cross-origin requests
});


socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
});


socket.on('your-event-name', (data) => {
    console.log('Data received from server:', data);
});

// Render the React application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
