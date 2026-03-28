import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { DealsProvider } from './data/DealsContext'
import { AuthProvider } from './data/AuthContext'
import './styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DealsProvider>
          <App />
        </DealsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
