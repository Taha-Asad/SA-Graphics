import { Box, Container, Grid, IconButton, Link, Typography } from '@mui/material'
import React from 'react'
import { Social } from '../Navbar/Social'

const Footer = () => {
  return (
    <>
      {/* #F4FAFD */}
      <Box sx={{
        width: "100%",
        bgcolor: "#F4FAFD",
        position: "relative",
        padding: { xs: "60px 0", md: "80px 0" },
        overflow: "hidden",
      }}
        data-aos="fade-up">
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <img src="" alt="" />
                <Typography component={"h4"} variant='h5'>Sheraz <span style={{color:"#149DDD"}}> Amjad</span></Typography>
                <Box display={'flex'}>{Social.map((socialLinks , index)=>{
                  <Grid key={index}>
                    <Link href={socialLinks.link} target='_blank'>
                      <IconButton>
                        <span>{socialLinks.icon}</span>
                      </IconButton>
                    </Link>
                  </Grid>
                })}</Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Footer