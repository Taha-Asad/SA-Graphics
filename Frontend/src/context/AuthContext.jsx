import React, { createContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData && userData !== "undefined") { 
            console.log("User data from storage:", userData);
            setUser(JSON.parse(userData));
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

    console.log("Saving User:", userData); // Debugging
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData)); // Ensure user data is stored correctly

    setUser(userData);
}, []);


  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };