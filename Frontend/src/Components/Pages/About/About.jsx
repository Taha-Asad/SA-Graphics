import React from 'react'
import image from "/assets/PFP/my-profile-img.jpg"
import { IoIosArrowForward } from "react-icons/io";

import "../../../index.css"
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
const About = () => {
  return (
    <>
      {/* <div className="container relative top-14 bottom-36">
    <h1 className='text-4xl absolute left-5 font-bold'>About</h1>
    <p className='absolute top-24 left-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid eligendi, enim nobis eum harum quibusdam facilis magnam iusto hic provident praesentium voluptatem officia quod quis quidem laboriosam ipsum ipsa eius tenetur eveniet! Voluptate placeat, perferendis possimus repellat voluptas a quasi deserunt, in, quia expedita rerum. Totam ex quam minima excepturi.</p>
    <div className="flex absolute top-52 left-5">
        <img src={image} width={"30%"} className='' alt="" />
        <div>
            <h2 className='text-3xl absolute left-82 font-bold'>UI/UX Designer & Web Developer.
            </h2>
            <p className='italic para'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex content-table ">
                <div className="content flex flex-col col-1">
                  <span className='info'><IoIosArrowForward className='inline  text-[#149ddd] '/><b>Birthday: </b>27 Feb, 2007</span>
                  <span className='info'><IoIosArrowForward className='inline  text-[#149ddd]'/><b>Website: </b>www.example.com</span>
                  <span className='info'><IoIosArrowForward className='inline  text-[#149ddd]'/><b>Phone: </b>+92 300 300000</span>
                  <span className='info'><IoIosArrowForward className='inline  text-[#149ddd]'/><b>City: </b>Sialkot</span>
                </div>
                <div className="content flex flex-col col-1">
                <span className='info'><IoIosArrowForward className='inline  text-[#149ddd]'/><b>Age: </b>18</span>
                  <span className='info'><IoIosArrowForward className='inline text-[#149ddd]'/><b>Degree: </b>Intermediate</span>
                  <span className='info'><IoIosArrowForward className='inline text-[#149ddd]'/><b>Email: </b>email@example.com</span>
                  <span className='info'><IoIosArrowForward className='inline text-[#149ddd]'/><b>Freelance: </b>Available</span>
                </div>
            </div>
        </div>
    </div>
    </div> */}
      <Container 
      id='about'
       sx={
        {
          position: "relative",
          mt: "30%"
        }
      }>
        <Typography variant='h3' component="h2" sx={{
          position: "relative",
          fontFamily: "Raleway",
          fontWeight: "500",
          mb: "50px",
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
        <Typography variant='p' component="h6" sx={{
          fontFamily: "Raleway",
          fontWeight: "500",
          mb: "50px",
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
            <Typography variant="h4" sx={{ mb: "20px" }} data-aos="fade-left">
              Title Goes Here
            </Typography>
            <Typography variant='p' component='h6' sx={{ mb: "40px" }} data-aos="fade-left">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid eligendi, enim nobis eum harum quibusdam facilis magnam iusto hic provident praesentium voluptatem officia quod quis quidem laboriosam ipsum ipsa eius tenetur eveniet! Voluptate placeat</Typography>
            <Grid container spacing={2}>
              {/* First Arrow Column */}
              <Grid item xs={12} sm={6} data-aos="fade-up">
                <Stack spacing={5}>
                  <span><IoIosArrowForward style={{ display:'inline', color: "#149ddd", fontSize: "20px" }}/><b>Birthday: </b>27 Feb, 2007</span>
                  <span><IoIosArrowForward style={{display:'inline',  color: "#149ddd", fontSize: "20px" }}/><b>Website: </b>www.example.com</span>
                  <span><IoIosArrowForward style={{ display:'inline', color: "#149ddd", fontSize: "20px" }}/><b>Phone: </b>+92 300 300000</span>
                  <span><IoIosArrowForward style={{ display:'inline', color: "#149ddd", fontSize: "20px" }}/><b>City: </b>Sialkot</span>
                </Stack>
              </Grid>

              {/* Second Arrow Column */}
              <Grid item xs={12} sm={6} data-aos="fade-up">
                <Stack spacing={5} >
                  <span><IoIosArrowForward style={{ display:'inline', color: "#149ddd", fontSize: "20px" }}/><b>Age: </b>18</span>
                  <span><IoIosArrowForward style={{ display:'inline', color: "#149ddd", fontSize: "20px" }}/><b>Degree: </b>Intermediate</span>
                  <span><IoIosArrowForward style={{ display:'inline', color: "#149ddd", fontSize: "20px" }}/><b>Email: </b>email@example.com</span>
                  <span><IoIosArrowForward style={{ display:'inline', color: "#149ddd", fontSize: "20px" }}/><b>Freelance: </b>Available</span>
                </Stack>
              </Grid>
              <Typography variant='p' component='h6' sx={{ mb: "40px" , mt: "40px" , ml: "20px"}} data-aos="fade-left">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid eligendi, enim nobis eum harum quibusdam facilis magnam iusto hic provident praesentium</Typography>
            </Grid>
          </Grid>
        </Grid>


      </Container>
    </>
  )
}

export default About
