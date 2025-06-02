// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {' '}
        {/* Wrap your App */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
