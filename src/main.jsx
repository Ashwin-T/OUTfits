import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { BrowserRouter } from 'react-router-dom'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter >
      {
        window.innerWidth > 768 ? 
        <div style = {{textAlign: 'center', marginTop: '45vh'}}>
          <h1>Sorry, this web app is not supported on large devices</h1>
          <h3>Change to a smaller device or change window size</h3> 
        </div>
          : <App />
      }
    </BrowserRouter >
  </React.StrictMode>
)
