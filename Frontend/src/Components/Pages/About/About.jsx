import React from 'react'
import image from "/assets/PFP/my-profile-img.jpg"
import { IoIosArrowForward } from "react-icons/io";

import "../../../index.css"
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
const About = () => {
  return (
    <>
      <Container 
      id='about'
       sx={
        {
          position: "relative",
          marginTop: "-80px",
        }
      }>
        <Typography variant='h3' component="h2" sx={{
          position: "relative",
          fontFamily: "Raleway",
          fontWeight: "500",
          mb: "50px",
          color: "#000000",
          "&::after": {
            content: '""',  // Required for pseudo-elements
            position: "absolute",
            width: "85px",   // Adjust width as needed
            height: "4px",   // Thickness of the line
            backgroundColor: "#149ddd",  // Example color (orange)
            bottom: "-10px",  // Spacing below text
            left: "40px",
            transform: "translateX(-50%)", // Centers the line
          }
        }}
          data-aos="fade-down"
        >About</Typography>
        <Typography variant="body1" component="div" sx={{
          fontFamily: "Raleway",
          fontWeight: "500",
          mb: "50px",
          color: "#6a6a6b",
        }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid eligendi, enim nobis eum harum quibusdam facilis magnam iusto hic provident praesentium voluptatem officia quod quis quidem laboriosam ipsum ipsa eius tenetur eveniet! Voluptate placeat, perferendis possimus repellat voluptas a quasi deserunt, in, quia expedita rerum. Totam ex quam minima excepturi.</Typography>
        <Grid container spacing={2}>
          {/* Left Column - Image */}
          <Grid item xs={12} md={4} textAlign="center" data-aos="fade-right">
            <Box>
              <img src={image} alt="Image" style={{ width: "100%", maxWidth: "350px" }} />
            </Box>
          </Grid>

          {/* Right Column - Title & Arrow Stacks */}
          <Grid item xs={12} md={8}>
            {/* Title */}
            <Typography variant="h4" sx={{ mb: "20px", color: "#000000" }} data-aos="fade-left">
              Title Goes Here
            </Typography>
            <Typography 
              variant="body1" 
              component="div" 
              sx={{ mb: "40px", color: "#6a6a6b" }} 
              data-aos="fade-left"
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid eligendi, enim nobis eum harum quibusdam facilis magnam iusto hic provident praesentium voluptatem officia quod quis quidem laboriosam ipsum ipsa eius tenetur eveniet! Voluptate placeat
            </Typography>
            <Grid container spacing={2}>
              {/* First Arrow Column */}
              <Grid item xs={12} sm={6} data-aos="fade-up">
                <Stack spacing={5}>
                  <span style={{ color: "#6a6a6b" }}><IoIosArrowForward style={{ display:'inline', color: "#149ddd", fontSize: "20px" }}/><b style={{ color: "#000000" }}>Birthday: </b>27 Feb, 2007</span>
                  <span style={{ color: "#6a6a6b" }}><IoIosArrowForward style={{display:'inline',  color: "#149ddd", fontSize: "20px" }}/><b style={{ color: "#000000" }}>Website: </b>www.example.com</span>
                  <span style={{ color: "#6a6a6b" }}><IoIosArrowForward style={{ display:'inline', color: "#149ddd", fontSize: "20px" }}/><b style={{ color: "#000000" }}>Phone: </b>+92 300 300000</span>
                  <span style={{ color: "#6a6a6b" }}><IoIosArrowForward style={{ display:'inline', color: "#149ddd", fontSize: "20px" }}/><b style={{ color: "#000000" }}>City: </b>Sialkot</span>
                </Stack>
              </Grid>

              {/* Second Arrow Column */}
              <Grid item xs={12} sm={6} data-aos="fade-up">
                <Stack spacing={5} >
                  <span style={{ color: "#6a6a6b" }}><IoIosArrowForward style={{ display:'inline', color: "#149ddd", fontSize: "20px" }}/><b style={{ color: "#000000" }}>Age: </b>18</span>
                  <span style={{ color: "#6a6a6b" }}><IoIosArrowForward style={{ display:'inline', color: "#149ddd", fontSize: "20px" }}/><b style={{ color: "#000000" }}>Degree: </b>Intermediate</span>
                  <span style={{ color: "#6a6a6b" }}><IoIosArrowForward style={{ display:'inline', color: "#149ddd", fontSize: "20px" }}/><b style={{ color: "#000000" }}>Email: </b>email@example.com</span>
                  <span style={{ color: "#6a6a6b" }}><IoIosArrowForward style={{ display:'inline', color: "#149ddd", fontSize: "20px" }}/><b style={{ color: "#000000" }}>Freelance: </b>Available</span>
                </Stack>
              </Grid>
              <Typography variant="body1" component="div" sx={{ mt: "40px" , ml: "20px", color: "#6a6a6b"}} data-aos="fade-left">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid eligendi, enim nobis eum harum quibusdam facilis magnam iusto hic provident praesentium</Typography>
            </Grid>
          </Grid>
        </Grid>


      </Container>
    </>
  )
}

export default About
