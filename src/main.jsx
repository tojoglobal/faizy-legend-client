import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />

    <ToastContainer
      position="bottom-left"
      autoClose={1500}
      hideProgressBar={true}
      pauseOnHover={false}
      draggable={true}
      theme="dark"
    />
  </StrictMode>,
)
