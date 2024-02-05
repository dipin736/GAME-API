import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider,ColorModeScript } from '@chakra-ui/react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import theme from './theme.jsx'
import { AuthProvider } from './context/AuthContext.jsx';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
     <AuthProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
        <App />
        <ToastContainer />
      </AuthProvider>

    </ChakraProvider>
  </React.StrictMode>,
)

