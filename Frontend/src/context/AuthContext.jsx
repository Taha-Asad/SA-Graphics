import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import LoadingFallback from "../Components/LoadingFallback";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate token and auto-login
  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
          setLoading(false);
          return;
        }

        // Try to parse user data
        let parsedUser;
        try {
          parsedUser = JSON.parse(userData);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setLoading(false);
          return;
        }

        // Set up axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Ensure user has a role property
        if (!parsedUser.role) {
          parsedUser.role = "user";
        }

        // Set the user state
        setUser(parsedUser);
        setLoading(false);
      } catch (error) {
        console.error("Token validation error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = useCallback((token, userData) => {
    if (!token || !userData) {
      console.error("Invalid token or user data!");
      return;
    }

    // Ensure user has a role property
    if (!userData.role) {
      userData.role = "user";
    }

    // Set up axios default headers
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const updateUser = useCallback((updatedData) => {
    if (!user) {
      console.error("No user to update!");
      return;
    }

    const updatedUser = {
      ...user,
      ...updatedData
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, [user]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };