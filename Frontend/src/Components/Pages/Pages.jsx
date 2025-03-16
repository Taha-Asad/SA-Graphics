import React, { useRef } from 'react'
import Home from './Home/Home'
import About from './About/About'
import Resume from './Resume/Resume'
import Portfolio from './Portfolio/Portfolio'
import Services from './Services/Services'
import Testimonials from './Testimonials/Testimonials'
import Contact from './Contact/Contact'

const Pages = () => {
  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    resume: useRef(null),
    portfolio: useRef(null),
    services: useRef(null),
    testimonials: useRef(null),
    contact: useRef(null),
  }
  return (
    <>
      <div className="container relative left-[24%] right-0 p-0 m-0 w-[76%]">
        <div ref={sectionRefs.home}> <Home /> </div>
        <div ref={sectionRefs.about}> <About /> </div>
        <div ref={sectionRefs.resume}> <Resume /> </div>
        <div ref={sectionRefs.portfolio}> <Portfolio /> </div>
        <div ref={sectionRefs.services}> <Services /> </div>
        <div ref={sectionRefs.testimonials}> <Testimonials /> </div>
        <div ref={sectionRefs.contact}> <Contact /> </div>
      </div>
    </>
  )
}

export default Pages