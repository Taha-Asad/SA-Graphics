import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./home.css";
import heroBg from "../../../../public/assets/Hero/hero-bg.jpg"
import { Box, Typography } from "@mui/material";

const words = ["Freelancer", "Graphic Designer", "Writer", "Entrepreneur"];

const Home = () => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const currentWord = words[index];
    let timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setText((prev) => prev.slice(0, -1));
        setSpeed(50);
      }, speed);
    } else {
      timeout = setTimeout(() => {
        setText((prev) => currentWord.slice(0, prev.length + 1));
        setSpeed(150);
      }, speed);
    }

    if (!isDeleting && text === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
    }
    document.documentElement.style.setProperty("--underline-width", `${text.length * 15}px`);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, speed]);
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
          brightness: "0.8",
          position: "absolute",
          mt: "132px",
          filter: "brightness(0.8)",
        }}
        // className="bg-[url(/assets/Hero/hero-bg.jpg)] bg-cover bg-center h-[100vh] w-[100%] brightness-[0.8]"
        data-aos="fade-in"
      />

      {/* Content Section with AOS animations */}
      <Box className="content" sx={{ position: "relative", paddingTop: "20%" }}>
        <Typography variant="h2"
          sx={{
            mt: "50px",
            ml: "122px",
          }}
          className="text-white"
          data-aos="fade-up"
        >
          Sheraz Amjad
        </Typography>
        <Typography variant="h3"
          sx={{
            mt: "10px",
            ml: "125px",
          }}
          className="text-white"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <span className="titles">I'm {text}</span>
          <span className="animate-blink">|</span>
        </Typography>
      </Box>
    </>
  );
};

export default Home;
