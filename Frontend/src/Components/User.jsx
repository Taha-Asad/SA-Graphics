import React, { useEffect, useState, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Element } from "react-scroll";
import { Box, CircularProgress } from "@mui/material";

// Direct imports instead of lazy loading
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Resume from "./Pages/Resume/Resume";
import Portfolio from "./Pages/Portfolio/Portfolio";
import Services from "./Pages/Services/Services";
import Testimonials from "./Pages/Testimonials/Testimonials";
import Contact from "./Pages/Contact/Contact";
import AddTestimonial from "./Pages/Testimonials/AddTestimonial";

// Loading component
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

const User = () => {
  const [aosInitialized, setAosInitialized] = useState(false);

  useEffect(() => {
    console.log("User component mounted");
    
    // Force scroll to top first
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;

    // Initialize AOS with optimized settings
    const initAOS = () => {
      AOS.init({
        duration: 800,
        offset: 100,
        easing: "ease-in-out",
        once: true,
        disable: window.innerWidth < 768,
        startEvent: 'load',
        mirror: false,
        anchorPlacement: 'top-bottom',
      });
      setAosInitialized(true);
    };

    const timer = setTimeout(initAOS, 300);

    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (aosInitialized) AOS.refresh();
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [aosInitialized]);

  const sectionStyle = {
    py: { xs: 8, md: 4 }, // Consistent vertical padding
    minHeight: '100vh', // Ensure minimum height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  return (
    <div className="user-container">
      <Element 
        name="home" 
        data-aos="fade-up" 
        data-aos-duration="800"
        style={{ minHeight: '100vh' }} // Special case for home section
      >
        <Home />
      </Element>
      
      <Element 
        name="about" 
        data-aos="fade-up" 
        data-aos-duration="800"
        style={sectionStyle}
      >
        <About />
      </Element>
      
      <Element 
        name="resume" 
        data-aos="fade-up" 
        data-aos-duration="800"
        style={sectionStyle}
      >
        <Resume />
      </Element>
      
      <Element 
        name="portfolio" 
        data-aos="fade-up" 
        data-aos-duration="800"
        style={sectionStyle}
      >
        <Portfolio/>
      </Element>
      
      <Element 
        name="service" 
        data-aos="fade-up" 
        data-aos-duration="800"
        style={sectionStyle}
      >
        <Services />
      </Element>
      
      <Element 
        name="testimonials" 
        data-aos="fade-up" 
        data-aos-duration="800"
        style={sectionStyle}
      >
        <Testimonials />
      </Element>
      
      <Element 
        name="contact" 
        data-aos="fade-up" 
        data-aos-duration="800"
        style={sectionStyle}
      >
        <Contact />
      </Element>
    </div>
  );
};

export default User;
