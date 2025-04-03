import React, { useState, useContext, useEffect } from 'react';
import "./Nav.css";
import { Box, Button, Container, Link as MuiLink, Stack } from '@mui/material';
import { Social } from './Social.jsx';
import { Links } from './Links.jsx';
import { MdClose, MdMenu, MdOutlineAccountCircle } from 'react-icons/md';
import { CiShoppingCart } from 'react-icons/ci';
import { AuthContext } from '../../context/AuthContext.jsx';
import pfp from "../../../public/assets/PFP/my-profile-img.jpg"
import AccountSideBar from './user/AccountSideBar.jsx';
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [userSideBar, setUserSideBar] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Only hide navbar for admin users on admin routes
  if (user && user.role === "admin" && window.location.pathname.startsWith('/admin')) {
    return null;
  }

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      <Box sx={{ width: "100%", height: "25vh", bgcolor: "#040B14", position: 'relative' }}>
        <Container>
          <Stack direction={'row'} pt={"20px"} alignContent={"center"}>
            <Box sx={{
              width: "90px", borderRadius: "100px", height: "90px", borderStyle: 'solid', borderWidth: "6px",
              borderColor: "#292F37", backgroundImage: `url(${pfp})`, backgroundPosition: "center", backgroundSize: "contain", backgroundRepeat: "no-repeat"
            }}>
              <RouterLink to="/" style={{ textDecoration: 'none' }}>
                <h1>
                  <span className='fName'>SHERAZ</span>
                  <span className='lName'>AMJAD</span>
                </h1>
              </RouterLink>
            </Box>
            {!isAuthPage && isHomePage && (
              <Box ml={"120px"} pt={"10px"} pl={"100px"} zIndex={1000}>
                {Links.map((link) => (
                  <ScrollLink
                    key={link.id}
                    to={link.to}
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                  >
                    <MuiLink
                      underline="none"
                      sx={{
                        color: "#fff",
                        mt: "20px",
                        position: "relative",
                        pl: "20px",
                        fontSize: "18px",
                        cursor: "pointer",
                        textDecoration: "none",
                      }}
                      className={link.cName}
                    >
                      {link.title}
                    </MuiLink>
                  </ScrollLink>
                ))}
              </Box>
            )}
            <Box sx={{
              mt: "20px",
              position: "absolute",
              right: "120px"
            }}>
              <Button sx={{
                zIndex: "100"
              }} onClick={() => {
                console.log("button is clicked");
                setUserSideBar(!userSideBar);
              }}>
                <MdOutlineAccountCircle color='white' fontSize={"33px"} />
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
      {userSideBar && (
        <Box
          className={`md:hidden`}
          sx={{
            position: "fixed",
            inset: 0,
            opacity: 0.5,
            zIndex: 30,
          }}
          onClick={() => setUserSideBar(false)}
        />
      )}
      <Box
        sx={{
          width: "25%",
          height: "100vh",
          overflowX: "hidden",
          position: "fixed",
          backgroundColor: "#1e242c",
          color: "white",
          right: 0,
          top: 0,
          transform: `${userSideBar ? "translateX(0)" : "translateX(100%)"}`,
          transition: "transform 1s ease-in-out, opacity 1s ease-in-out",
          opacity: userSideBar ? 1 : 0,
          visibility: userSideBar ? "visible" : "hidden",
          zIndex: 9999,
        }}
      >
        <Box sx={{
          transition: "all 1s ease-in-out",
        }}>
          <AccountSideBar onClose={() => setUserSideBar(false)} />
          <Button
            sx={{
              zIndex: 999999999999999,
              color: "white",
              fontSize: "30px",
              mt: "-250%",
            }}
            onClick={() => setUserSideBar(false)}
          >
            <MdClose />
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Navbar;
