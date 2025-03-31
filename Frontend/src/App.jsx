import { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { AuthContext } from "./context/AuthContext.jsx";
import Admin from "./admin/Admin";
import User from "./Components/User";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Login from "./Components/authentication/Login.jsx";
import Register from "./Components/authentication/Register.jsx";
import ForgotPassword from "./Components/authentication/ForgotPassword.jsx";
import ResetPassword from "./Components/authentication/ResetPassword.jsx";
import Footer from "./Components/Footer/Footer.jsx";

import "./index.css";

function App() {
  const { user } = useContext(AuthContext);

  console.log("User in App:", user); // ✅ Debugging step

  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Publicly Accessible Pages */}
          <Route path="/" element={<User />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Admin Panel - Only for Admins */}
          <Route
            path="/admin"
            element={user && user.role === "admin" ? <Admin /> : <Navigate to="/" />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
