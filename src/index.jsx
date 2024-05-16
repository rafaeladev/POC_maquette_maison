import ReactDOM from 'react-dom/client';
import React from 'react';
import Home from './pages/Home.jsx';
import './styles/style.css';

const root = ReactDOM.createRoot(document.querySelector('#root'));

root.render(
    <React.StrictMode>
        <Home />
    </React.StrictMode>
);
