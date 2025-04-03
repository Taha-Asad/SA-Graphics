import { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from "./context/AuthContext.jsx";
import Admin from "./admin/Admin";
import User from "./Components/User";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Login from "./Components/authentication/Login.jsx";
import Register from "./Components/authentication/Register.jsx";
import ForgotPassword from "./Components/authentication/ForgotPassword.jsx";
import ResetPassword from "./Components/authentication/ResetPassword.jsx";
// import Footer from "./Components/Footer/Footer.jsx";

import "./index.css";

function App() {
  const { user } = useContext(AuthContext);

  // Reset scroll position on route change
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  console.log("User in App:", user); // ✅ Debugging step

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          {/* Publicly Accessible Pages with Navbar */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <User />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <Login />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Navbar />
                <Register />
              </>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <>
                <Navbar />
                <ForgotPassword />
              </>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <>
                <Navbar />
                <ResetPassword />
              </>
            }
          />

          {/* Admin Panel - Only for Admins */}
          <Route
            path="/admin/*"
            element={user && user.role === "admin" ? <Admin /> : <Navigate to="/" />}
          />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
