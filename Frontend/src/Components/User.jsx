import React, { useEffect } from "react";
import About from "./Pages/About/About";
import Services from "./Pages/Services/Services";
import Resume from "./Pages/Resume/Resume";
import Home from "./Pages/Home/Home";
import Testimonials from "./Pages/Testimonials/Testimonials";
import AOS from "aos";
import "aos/dist/aos.css";
import { Element } from "react-scroll";
import Contact from "./Pages/Contact/Contact";
import Portfolio from "./Pages/Portfolio/Portfolio";

const User = () => {
  useEffect(() => {
    // Force scroll to top first
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;

    // Initialize AOS with a slight delay to ensure proper initialization
    setTimeout(() => {
      AOS.init({
        duration: 1000,
        offset: 50, // Reduced offset to trigger animations earlier
        easing: "ease-in-out",
        once: false, // Allow animations to repeat
        disable: false,
        startEvent: 'load',
        mirror: true, // Enable mirror effect
        anchorPlacement: 'top-bottom', // Trigger animation when top of element reaches bottom of viewport
      });
      
      // Refresh AOS after initialization
      AOS.refresh();
    }, 100);

    // Add scroll event listener to refresh AOS
    window.addEventListener('scroll', () => {
      AOS.refresh();
    });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', () => {
        AOS.refresh();
      });
    };
  }, []);

  return (
    <>
      <Element name="home" data-aos="fade-up" data-aos-duration="1000">
        <Home />
      </Element>
      <Element name="about" data-aos="fade-up" data-aos-duration="1000">
        <About />
      </Element>
      <Element name="resume" data-aos="fade-up" data-aos-duration="1000">
        <Resume />
      </Element>
      <Element name="portfolio" data-aos="fade-up" data-aos-duration="1000">
        <Portfolio/>
      </Element>
      <Element name="service" data-aos="fade-up" data-aos-duration="1000">
        <Services />
      </Element>
      <Element name="testimonials" data-aos="fade-up" data-aos-duration="1000">
        <Testimonials />
      </Element>
      <Element name="contact" data-aos="fade-up" data-aos-duration="1000">
        <Contact />
      </Element>
    </>
  );
};

export default User;
