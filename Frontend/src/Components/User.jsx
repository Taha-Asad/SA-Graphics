import React, { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Element } from "react-scroll";
import { Box } from "@mui/material";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import FixedSocialMenu from "./FixedSocialMenu/FixedSocialMenu";

// Direct imports instead of lazy loading
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
// import Resume from "./Pages/Resume/Resume";
import Portfolio from "./Pages/Portfolio/Portfolio";
import Services from "./Pages/Services/Services";
import Testimonials from "./Pages/Testimonials/Testimonials";
import Contact from "./Pages/Contact/Contact";
import CoursesSection from "./Pages/Courses/CoursesSection";

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
        overflowX: 'hidden',
        position: 'relative'
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
        
        {/* <Element name="resume">
          <Resume />
        </Element> */}
        
        <Element name="portfolio">
          <Portfolio />
        </Element>
        
        <Element name="services">
          <Services />
        </Element>

        <Element name="courses">
          <CoursesSection />
        </Element>
        
        <Element name="testimonials">
          <Testimonials />
        </Element>
        
        <Element name="contact">
          <Contact />
        </Element>
      </Box>
      <Footer />
      
      {/* Fixed Social Menu Container */}
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 99999,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          padding: '20px'
        }}
      >
        <FixedSocialMenu />
      </Box>
    </Box>
  );
};

export default User;
