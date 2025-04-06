import React, { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Element } from "react-scroll";
import { Box } from "@mui/material";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

// Direct imports instead of lazy loading
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Resume from "./Pages/Resume/Resume";
import Portfolio from "./Pages/Portfolio/Portfolio";
import Services from "./Pages/Services/Services";
import Testimonials from "./Pages/Testimonials/Testimonials";
import Contact from "./Pages/Contact/Contact";

const User = () => {
  const [aosInitialized, setAosInitialized] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const aosInitTimeoutRef = useRef(null);

  useEffect(() => {
    // Force scroll to top on mount
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    
    // Prevent scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Initialize AOS with optimized settings
    const initAOS = () => {
      if (!aosInitialized) {
        console.log("Initializing AOS");
        AOS.init({
          duration: 800,
          offset: 100,
          easing: "ease-in-out",
          once: true,
          mirror: false,
          anchorPlacement: 'top-bottom',
        });
        setAosInitialized(true);
      }
    };

    // Delay AOS initialization slightly to ensure DOM is ready
    aosInitTimeoutRef.current = setTimeout(initAOS, 100);

    const handleScroll = () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        if (aosInitialized) {
          AOS.refresh();
        }
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (aosInitTimeoutRef.current) clearTimeout(aosInitTimeoutRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      window.removeEventListener('scroll', handleScroll);
      
      // Reset scroll restoration on unmount
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, [aosInitialized]);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        overflowX: 'hidden'
      }}
    >
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flex: '1 0 auto',
          overflowX: 'hidden'
        }}
      >
        <Element name="home">
          <Home />
        </Element>
        
        <Element name="about">
          <About />
        </Element>
        
        <Element name="resume">
          <Resume />
        </Element>
        
        <Element name="portfolio">
          <Portfolio />
        </Element>
        
        <Element name="services">
          <Services />
        </Element>
        
        <Element name="testimonials">
          <Testimonials />
        </Element>
        
        <Element name="contact">
          <Contact />
        </Element>
      </Box>
      <Footer />
    </Box>
  );
};

export default User;
