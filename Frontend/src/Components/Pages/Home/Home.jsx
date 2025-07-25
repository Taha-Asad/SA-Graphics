import React, { useEffect, useRef } from "react";
import "./home.css";
import { Box, Typography, useTheme, useMediaQuery, Grid, Card, CardMedia, Container } from "@mui/material";
import Gallery from "../Gallery/Gallery";
const words = ["Developer", "Freelancer", "Designer"];

const Home = () => {
  const textRef = useRef(words[0]);
  const indexRef = useRef(0);
  const isDeletingRef = useRef(false);
  const speedRef = useRef(150);
  const timeoutRef = useRef(null);
  const displayTextRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (displayTextRef.current) {
      displayTextRef.current.textContent = words[0];
      document.documentElement.style.setProperty("--underline-width", `${words[0].length * 15}px`);
    }

    const typeEffect = () => {
      const currentWord = words[indexRef.current];
      
      if (isDeletingRef.current) {
        textRef.current = textRef.current.slice(0, -1);
        speedRef.current = 50;
      } else {
        textRef.current = currentWord.slice(0, textRef.current.length + 1);
        speedRef.current = 150;
      }

      if (displayTextRef.current) {
        displayTextRef.current.textContent = textRef.current;
      }

      document.documentElement.style.setProperty("--underline-width", `${textRef.current.length * 15}px`);

      if (!isDeletingRef.current && textRef.current === currentWord) {
        timeoutRef.current = setTimeout(() => {
          isDeletingRef.current = true;
          typeEffect();
        }, 1500);
        return;
      } 
      
      if (isDeletingRef.current && textRef.current === "") {
        isDeletingRef.current = false;
        indexRef.current = (indexRef.current + 1) % words.length;
      }

      timeoutRef.current = setTimeout(typeEffect, speedRef.current);
    };

    timeoutRef.current = setTimeout(typeEffect, 1500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
    <Box 
      id="home"
      sx={{ 
        width: '100%', 
        height: '100vh',
        position: 'relative',
        backgroundColor: "#FAF4FD",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: {md:'150px', xs: "140px"},
        mb: '0px',
        overflow: 'hidden'
      }}
    >
      {/* Updated Background Image with proper path */}
      <Box
      className="hero-bg"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }
        }}
      />
      
      {/* Content - unchanged */}
      <Box 
        sx={{ 
          position: 'relative',
          zIndex: 1,
          px: { xs: 3, md: 10 },
          maxWidth: '1200px',
          mx: 'auto',
          width: '100%',
          textAlign: isMobile ? 'center' : 'left'
        }}
      >
        <Typography 
          variant="h1"
          sx={{
            color: "#ffffff",
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
            fontWeight: 700,
            lineHeight: 1,
            mb: { xs: 2, md: 1 },
            letterSpacing: "-0.02em",
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
          data-aos="fade-up"
        >
          SA <span style={{ color: "#149ddd" }}>Grafix</span>
        </Typography>
        
        <Typography 
          variant="h2"
          sx={{
            color: "#ffffff",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            fontWeight: 400,
            opacity: 0.85,
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: isMobile ? 'center' : 'flex-start',
            flexWrap: 'wrap',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          I'm <span className="typing" ref={displayTextRef}></span>
          <span className="cursor"></span>
        </Typography>
      </Box>
    </Box>
      <Gallery/>
    </>
  );
};

export default React.memo(Home);