import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app'; // 'app' em minúsculo e sem as chaves

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);