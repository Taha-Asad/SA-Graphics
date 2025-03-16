import React, { useEffect, useState } from 'react'
import "./home.css"

const words = ["Freelancer", "Graphic Desinger", "Writer", "Entapenur"];
const Home = () => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setisDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);
  useEffect(() => {
    const currentWord = words[index];
    let timeOut;
    if (isDeleting) {
      timeOut = setTimeout(() => {
        setText(text.slice(0, -1))
        setSpeed(50);
      }, speed)
    } else {
      timeOut = setTimeout(() => {
        setText(currentWord.slice(0, text.length + 1));
        setSpeed(150);
      }, speed);
    }
    if(!isDeleting && text === currentWord){
      timeOut = setTimeout(()=> setisDeleting(true), 1500);
    }else if(isDeleting && text === ""){
      setisDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
    }
    return ()=> clearTimeout(timeOut);
    }
  , [text, isDeleting, index, speed])
  document.documentElement.style.setProperty("--underline-width", `${text.length * 17}px`);
  return (
    <>
      <div id='home' className="bg-[url(/assets/Hero/hero-bg.jpg)] bg-cover bg-center h-[100vh] w-[100%] brightness-[0.7]">
      </div>
      <div className="content">
        <h2 className='text-white absolute z-10 top-[40%] text-6xl left-5 font-bold'>Name of the person</h2>
        <h2 className='text-white absolute z-10 top-[50%] text-4xl left-5'><span className='titles'>I'm {text}</span><span className="animate-blink">|</span></h2>
      </div>
    </>
  )
}

export default Home








// import React, { useState, useEffect, useRef } from "react";

// const words = ["Developer", "Designer", "Freelancer", "Tech Enthusiast"];

// const TypingEffect = () => {
//   const [index, setIndex] = useState(0);
//   const [text, setText] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [speed, setSpeed] = useState(150);
//   const [isVisible, setIsVisible] = useState(false);
//   const typingRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setIsVisible(entry.isIntersecting);
//       },
//       { threshold: 0.5 } // Runs when at least 50% of the component is visible
//     );

//     if (typingRef.current) {
//       observer.observe(typingRef.current);
//     }

//     return () => {
//       if (typingRef.current) {
//         observer.unobserve(typingRef.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (!isVisible) return; // Only run the effect when the section is visible

//     const currentWord = words[index];
//     let timeout;

//     if (isDeleting) {
//       timeout = setTimeout(() => {
//         setText((prev) => prev.slice(0, -1));
//         setSpeed(50);
//       }, speed);
//     } else {
//       timeout = setTimeout(() => {
//         setText((prev) => currentWord.slice(0, prev.length + 1));
//         setSpeed(150);
//       }, speed);
//     }

//     if (!isDeleting && text === currentWord) {
//       timeout = setTimeout(() => setIsDeleting(true), 1500);
//     } else if (isDeleting && text === "") {
//       setIsDeleting(false);
//       setIndex((prev) => (prev + 1) % words.length);
//     }

//     // Update the underline dynamically
//     document.documentElement.style.setProperty("--underline-width", `${text.length * 12}px`);

//     return () => clearTimeout(timeout);
//   }, [text, isDeleting, index, isVisible]);

//   return (
//     <h1 ref={typingRef} className="titles text-4xl font-bold text-white relative">
//       I'm a <span className="text-[#107AAD]">{text}</span>
//       <span className="animate-blink">|</span>
//     </h1>
//   );
// };

// export default TypingEffect;
