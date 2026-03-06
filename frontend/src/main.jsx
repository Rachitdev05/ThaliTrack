import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios' // Import Axios

// --- CRITICAL CONFIGURATION ---
// This logic checks: "Am I running on Vercel/Netlify?" or "Am I on my laptop?"

if (import.meta.env.PROD) {
    // 🚀 PRODUCTION MODE (When deployed)
    // PASTE YOUR RENDER URL INSIDE THE QUOTES BELOW 👇
    axios.defaults.baseURL = "https://thalitrack-backend.onrender.com"; 
} else {
    // 💻 DEVELOPMENT MODE (Localhost)
    axios.defaults.baseURL = "http://localhost:5000";
}

// Optional: Ensure no credentials issues
axios.defaults.withCredentials = false; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)