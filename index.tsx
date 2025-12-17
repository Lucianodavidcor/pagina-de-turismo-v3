// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Importamos BrowserRouter
import { BrowserRouter } from 'react-router-dom'; 
import App from './App';
// import './index.css'; // Descomenta si usas estilos globales aquí

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* 2. Envolvemos TODA la App con BrowserRouter aquí */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);