import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const loadAtatus = async () => {
  const atatus = await import('atatus-spa');
  atatus.config('c4268f62dcb840fb9e22dfb970057dab').install();
};

loadAtatus();

serviceWorkerRegistration.register();

reportWebVitals();

