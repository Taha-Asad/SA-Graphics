import React, { createContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData && userData !== "undefined") {
        const parsedUser = JSON.parse(userData);
        console.log("User data from storage:", parsedUser);
        // Ensure user has a role property
        if (!parsedUser.role) {
          console.warn("User data missing role property");
          parsedUser.role = "user"; // Default role
        }
        setUser(parsedUser);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const login = useCallback((token, userData) => {
    if (!token || !userData) {
      console.error("Invalid token or user data!");
      return;
    }

    // Ensure user has a role property
    if (!userData.role) {
      console.warn("User data missing role property");
      userData.role = "user"; // Default role
    }

    console.log("Saving User:", userData); // Debugging
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  // Debug user state changes
  useEffect(() => {
    console.log("Current user state:", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };