import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext.jsx";
import ProfileIcon from "./profileIcon.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Box, Divider, Typography } from "@mui/material";
import { CiUser } from "react-icons/ci";

const AccountSideBar = ({ onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User updated in AccountSideBar:", user);
  }, [user]);


  const handleLinkClick = (path, action) => {
    if (action) action();
    if (path) navigate(path);
    if (onClose) onClose();
  };

  return (
    <div
      style={{
      //   background: "#1e242c",
      //   color: "#fff",
        padding: "20px",
      //   position: "relative",
      //   top: 0,
      //   right: 0,
      //   width: "100%",
      //   height: "100%",
      //   zIndex: 20,
      //   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Box sx={{ pt: "80px", pl: "50px" }}>
        <Typography variant="h5">
          {user ? `Welcome, ${user.name}!` : "Welcome, Guest!"}
        </Typography>
        
        <Box
          sx={{
            borderRadius: "100px",
            bgcolor: "white",
            ml: "55px",
            width: "80px",
            height: "80px",
            mt: "15px",
            zIndex: 8,
            position: "relative",
          }}
        >
          {user ? (
            <ProfileIcon />
          ) : (
            <CiUser 
              size={54} 
              style={{ 
                color: "black", 
                margin: "12px", 
                position: "absolute" 
              }} 
            />
          )}
        </Box>
        
        <Box sx={{ pt: "30px" }}>
          <Divider sx={{ my: 2, borderColor: "gray", ml: "-25px" }} />
          
          {user ? (
            <>
              <Link 
                to="#" 
                style={linkStyle} 
                onClick={() => handleLinkClick("/profile")}
              >
                Profile
              </Link>
              <Divider sx={{ my: 2, borderColor: "gray", ml: "-25px" }} />
              
              <Link 
                to="#" 
                style={linkStyle} 
                onClick={() => handleLinkClick("/orders")}
              >
                Orders
              </Link>
              <Divider sx={{ my: 2, borderColor: "gray", ml: "-25px" }} />
              
              <Link 
                to="#" 
                style={linkStyle} 
                onClick={() => handleLinkClick("/", logout)}
              >
                Log Out
              </Link>
              <Divider sx={{ my: 2, borderColor: "gray", ml: "-25px" }} />
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                style={linkStyle} 
                onClick={() => handleLinkClick("/login")}
              >
                Login
              </Link>
              <Divider sx={{ my: 2, borderColor: "gray", ml: "-25px" }} />
              
              <Link 
                to="/Register" 
                style={linkStyle} 
                onClick={() => handleLinkClick("/Register")}
              >
                Register
              </Link>
              <Divider sx={{ my: 2, borderColor: "gray", ml: "-25px" }} />
            </>
          )}
        </Box>
      </Box>
    </div>
  );
};

const linkStyle = {
  fontSize: "20px",
  textDecoration: "none",
  color: "white",
  cursor: "pointer",
  display: "block",
  padding: "10px 0",
  "&:hover": {
    color: "#ddd",
  },
};

export default AccountSideBar;