import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'      // tailwind
import './App.css'        // estilos del layout

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
