import React from 'react'
import ReactDOM from 'react-dom/client'
import LandingPage from './components/LandingPage'
import ProductView from './components/ProductView'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ProductView/>
  </React.StrictMode>,
)
