import React, { useEffect, useState, useCallback, useMemo } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./home.css";
import heroBg from "../../../../public/assets/Hero/hero-bg.jpg"
import { Box, Typography } from "@mui/material";

const words = ["Freelancer", "Graphic Designer", "Writer", "Entrepreneur"];

const Home = () => {
  console.log("Home component rendered");
  
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  // Memoize the current word to prevent unnecessary recalculations
  const currentWord = useMemo(() => words[index], [index]);

  // Use useCallback to memoize the typing effect function
  const typeEffect = useCallback(() => {
    if (isDeleting) {
      setText(prev => prev.slice(0, -1));
      setSpeed(50);
    } else {
      setText(prev => currentWord.slice(0, prev.length + 1));
      setSpeed(150);
    }

    if (!isDeleting && text === currentWord) {
      setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setIndex(prev => (prev + 1) % words.length);
    }
  }, [text, isDeleting, currentWord]);

  useEffect(() => {
    // Initialize AOS only once
    AOS.init({ duration: 1000, once: true });

    // Set up typing effect timer
    const timeout = setTimeout(typeEffect, speed);
    
    // Update CSS variable for underline width
    document.documentElement.style.setProperty("--underline-width", `${text.length * 15}px`);
    
    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, speed, typeEffect]);

  return (
    <>
      {/* Hero Section with AOS */}
      <Box
        id="home"
        sx={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          width: "100%",
          position: "relative",
          filter: "brightness(0.8)",
          marginTop: "50px",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }
        }}
        data-aos="fade-in"
      />

      {/* Content Section with AOS animations */}
      <Box 
        className="content" 
        sx={{ 
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          width: "100%",
          px: { xs: 2, sm: 4, md: 8 },
        }}
      >
        <Typography 
          variant="h2"
          sx={{
            color: "#ffffff",
            fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
            textAlign: { xs: "center", md: "left" },
            ml: { xs: 0, md: "122px" },
            mb: { xs: 2, md: 0 },
          }}
          data-aos="fade-up"
        >
          Sheraz Amjad
        </Typography>
        <Typography 
          variant="h3"
          sx={{
            color: "#ffffff",
            fontSize: { xs: "1.8rem", sm: "2rem", md: "2.5rem" },
            textAlign: { xs: "center", md: "left" },
            ml: { xs: 0, md: "125px" },
            mt: { xs: 1, md: "10px" },
          }}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <span className="titles">I'm {text}</span>
          <span className="animate-blink">|</span>
        </Typography>
      </Box>
    </>
  );
};

export default React.memo(Home);
