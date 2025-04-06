import React, { Suspense } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import LoadingFallback from './Components/LoadingFallback';
import AppRoutes from './routes/index';
import { Box } from '@mui/material';
import ScrollToTop from './Components/ScrollToTop';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#149ddd',
    },
    background: {
      default: '#F5F5F5',
      paper: '#fff',
    },
    text: {
      primary: '#333',
      secondary: '#666',
    }
  },
  typography: {
    fontFamily: 'Raleway, sans-serif',
  }
});

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ScrollToTop />
          <Box 
            component="div" 
            sx={{ 
              width: '100%',
              minHeight: '100vh',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <AppRoutes />
            </Suspense>
            <ToastContainer 
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </Box>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
