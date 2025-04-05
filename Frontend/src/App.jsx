import React, { Suspense } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import MainLayout from './Components/Layout/MainLayout';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import LoadingFallback from './Components/LoadingFallback';
import Navbar from './Components/Navbar/Navbar';
import AppRoutes from './routes/index';
import { Box } from '@mui/material';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#149ddd',
    },
    background: {
      default: '#F4FAFD',
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MainLayout>
            <Navbar />
            <Box 
              component="div" 
              sx={{ 
                width: '100%',
                minHeight: '100%'
              }}
            >
              <Suspense fallback={<LoadingFallback />}>
                <AppRoutes />
              </Suspense>
            </Box>
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
            />
          </MainLayout>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
