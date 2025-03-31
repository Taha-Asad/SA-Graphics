import React, { useEffect } from 'react'
import About from './Pages/About/About'
import Services from './Pages/Services/Services'
import Resume from './Pages/Resume/Resume'
import Home from './Pages/Home/Home'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Element } from "react-scroll";


const User = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      offset: 100, // Offset from top before animation starts
      easing: "ease-in-out", // Smooth animation
      once: true, // Animates only once
    });
  }, []);

  return (
    <>
      <Element name="home" data-aos="fade-right"><Home /></Element>
      <Element name= "about" data-aos="fade-bottom"><About/></Element>
      {/* <About />
      <Services />
      <Resume /> */}
    </>
  )
}

export default User