import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { ScreenProvider } from "./context/ScreenContext";
import router from './router/routes.jsx';
import './index.css'
// import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ScreenProvider>
      <RouterProvider router={router} />
    </ScreenProvider>
  </StrictMode>,
)
