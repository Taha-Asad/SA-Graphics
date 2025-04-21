import React from 'react'
import image from "/assets/PFP/my-profile-img.jpg"
import { IoIosArrowForward } from "react-icons/io";

import { Box, Container, Grid, Stack, Typography } from '@mui/material';
const About = () => {
  return (
    <>
<Box
bgcolor={"#FAF4FD"}
>
<Container 
      id='about'
       sx={
        {
          position: "relative",
          marginTop: "-140px",
          pt: 10,
          pb: 10
        }
      }>
        <Typography variant='h3' component="h2" sx={{
          position: "relative",
          fontWeight: "500",
          mb: "50px",
          color: "#000000",
          "&::after": {
            content: '""',
            position: "absolute",
            width: "85px",
            height: "4px",
            backgroundColor: "#149ddd",
            bottom: "-10px",
            left: "40px",
            transform: "translateX(-50%)",
          }
        }}
          data-aos="fade-down"
        >About</Typography>
        <Typography variant="body1" component="div" sx={{
          fontWeight: "500",
          mb: "50px",
          color: "#6a6a6b",
        }}>
          Sheraz Amjad is one of Pakistan's youngest and most dynamic voices in IT education, digital entrepreneurship, and motivational speaking. At just 18 years of age, he has empowered hundreds of students with modern digital skills, practical guidance, and inspirational life lessons.
        </Typography>
        <Grid container spacing={2}>
          {/* Left Column - Image */}
          <Grid item xs={12} md={4} textAlign="center" data-aos="fade-right">
            <Box>
              <img src={image} alt="Sheraz Amjad" style={{ width: "100%", maxWidth: "350px" }} />
            </Box>
          </Grid>

          {/* Right Column - Title & Arrow Stacks */}
          <Grid item xs={12} md={8}>
            {/* Title */}
            <Typography variant="h4" sx={{ mb: "20px", color: "#000000" }} data-aos="fade-left">
              Digital Mentor & Author
            </Typography>
            <Typography 
              variant="body1" 
              component="div" 
              sx={{ mb: "40px", fontWeight: "500" }} 
              data-aos="fade-left"
            >
              He began his journey during the COVID-19 pandemic, while he was in 7th grade. At a time when the world paused, Sheraz stepped forward—starting to learn, teach, and grow in the digital world. Today, he is the author of books on Graphic Designing, Digital Marketing, and YouTube, and has delivered powerful training sessions, seminars, and online courses that have changed the lives of countless students.
            </Typography>
            <Grid container spacing={2}>
              {/* First Column */}
              <Grid item xs={12} sm={6} data-aos="fade-up">
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h6" sx={{ color: "#000000", mb: 1, display: 'flex', alignItems: 'center' }}>
                      <IoIosArrowForward style={{ color: "#149ddd", fontSize: "20px" }}/>
                      Courses & Services
                    </Typography>
                    <Typography variant="body2" sx={{pl: 2 , fontSize: "18px"}}>
                      • Graphic Designing (Photoshop, Illustrator, InDesign)<br />
                      • Digital Marketing (SEO, Facebook Ads, Instagram)<br />
                      • YouTube Monetization & Growth<br />
                      • Computer Courses (Basic to Advanced)<br />
                      • Motivational Sessions
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ color: "#000000", mb: 1, display: 'flex', alignItems: 'center' }}>
                      <IoIosArrowForward style={{ color: "#149ddd", fontSize: "20px" }}/>
                      Books & Vision
                    </Typography>
                    <Typography variant="body2" sx={{ pl: 2 , fontSize: "18px" }}>

                      • Published author of books on Digital Skills<br />
                      • Bridge Pakistan's digital skills gap<br />
                      • Empower youth with self-reliance<br />
                      • Inspire growth with purpose
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              {/* Second Column */}
              <Grid item xs={12} sm={6} data-aos="fade-up">
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h6" sx={{ color: "#000000", mb: 1, display: 'flex', alignItems: 'center' }}>
                      <IoIosArrowForward style={{ color: "#149ddd", fontSize: "20px" }}/>
                      Why Sheraz Amjad?
                    </Typography>
                    <Typography variant="body2" sx={{ pl: 3 , fontSize: "18px" }}>
                      • Started journey at age 13 during COVID-19<br />
                      • Became a published author by 17<br />
                      • Trained hundreds across Pakistan<br />
                      • Modern, practical teaching style<br />
                      • Digital mentor for Pakistan's new generation
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ color: "#000000", mb: 1, display: 'flex', alignItems: 'center' }}>
                      <IoIosArrowForward style={{ color: "#149ddd", fontSize: "20px" }}/>
                      Contact Information
                    </Typography>
                    <Typography variant="body2" sx={{ pl: 3 , fontSize: "18px" }}>
                      • Location: Sialkot, Pakistan<br />
                      • Email: contact@sagraphics.com<br />
                      • Website: sagraphics.com<br />
                      • Age: 18 (Born: 27 Feb, 2007)
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Typography variant="body1" component="div" sx={{ 
                mt: "40px", 
                ml: "20px", 
                color: "#000000",
                fontStyle: "italic",
                fontWeight: "500"
              }} data-aos="fade-left">
                "I started in 7th grade and achieved this before 18 — now it's your turn."
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Container>
</Box>
    </>
  )
}

export default About
