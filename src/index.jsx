import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App.jsx';
import './styles/style.css';

const root = ReactDOM.createRoot(document.querySelector('#root'));

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
