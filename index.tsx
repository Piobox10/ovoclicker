
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App'; // Ensured this path is relative and updated to named import
import { Decimal } from 'decimal.js';

// Set Decimal.js precision globally
Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP }); // Increased precision for complex calculations

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
