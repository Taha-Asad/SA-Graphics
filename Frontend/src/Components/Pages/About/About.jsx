import React from 'react'
import image from "/assets/PFP/my-profile-img.jpg"
import { Box, Container, Grid, Typography, Button } from '@mui/material';

const About = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      bgcolor={"#FAF4FD"}
      id="about"
      sx={{
        position: "relative",
        marginTop: "-140px",
        pt: 10,
        pb: 10
      }}
    >
      <Container maxWidth="lg">
        {/* Top Section with Name, Contact, and Image */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {/* Left Side - Name and Contact */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h2" 
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: "500",
                mt: 5,
                mb: 4,
                color: "#149ddd",  
              }}
            >
              SA Grafix
            </Typography>

            <Typography 
              variant="h4" 
              sx={{ 
                mt: 2,
                mb: 4, 
                color: "black",
                fontWeight: "500",
              }}
            >
              A Mission To Empower Digital Success...
            </Typography>

            <Button
              variant="contained"
              onClick={scrollToContact}
              sx={{
                bgcolor: "#149ddd",
                color: "#ffffff",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "600",
                '&:hover': {
                  bgcolor: "#1180bb",
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }
              }}
            >
              CONTACT
            </Button>
          </Grid>

          {/* Right Side - Image */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                width: "70%",
                height: "80%",
                minHeight: "400px",
                marginLeft: "50px",
                position: "relative",
                overflow: "hidden",
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: "50%",
              }}
            >
              <img 
                src={image} 
                alt="Sheraz Amjad" 
                style={{ 
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }} 
              />
            </Box>
          </Grid>
        </Grid>

        {/* Main Description */}
        <Typography 
          variant="body1" 
          sx={{
            fontSize: "1.2rem",
            lineHeight: 1.8,
            mb: 8,
            color: "#6a6a6b",
            textAlign: "center",
            maxWidth: "900px",
            mx: "auto"
          }}
        >
          SA Grafix is one of Pakistan's youngest and most dynamic voices in IT education, digital entrepreneurship, and motivational speaking. At just 18 years of age, he has empowered hundreds of students with modern digital skills, practical guidance, and inspirational life lessons.
        </Typography>

        {/* Content Sections */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ color: "#000000", mb: 3, fontWeight: "600" }}>
                Courses & Services
              </Typography>
              <Typography variant="body1" sx={{ color: "#555", lineHeight: 2 }}>
                • Graphic Designing (Photoshop, Illustrator, InDesign)<br />
                • Digital Marketing (SEO, Facebook Ads, Instagram)<br />
                • YouTube Monetization & Growth<br />
                • Computer Courses (Basic to Advanced)<br />
                • Motivational Sessions
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ color: "#000000", mb: 3, fontWeight: "600" }}>
                Books & Vision
              </Typography>
              <Typography variant="body1" sx={{ color: "#555", lineHeight: 2 }}>
                • Published author of books on Digital Skills<br />
                • Bridge Pakistan's digital skills gap<br />
                • Empower youth with self-reliance<br />
                • Inspire growth with purpose
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ color: "#000000", mb: 3, fontWeight: "600" }}>
                Why SA Grafix ?
              </Typography>
              <Typography variant="body1" sx={{ color: "#555", lineHeight: 2 }}>
                • Started journey at age 13 during COVID-19<br />
                • Became a published author by 17<br />
                • Trained hundreds across Pakistan<br />
                • Modern, practical teaching style<br />
                • Digital mentor for Pakistan's new generation
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ color: "#000000", mb: 3, fontWeight: "600" }}>
                Contact Information
              </Typography>
              <Typography variant="body1" sx={{ color: "#555", lineHeight: 2 }}>
                • Location: Sialkot, Pakistan<br />
                • Email: contact@sagraphics.com<br />
                • Website: sagraphics.com<br />
                • Age: 18 (Born: 27 Feb, 2007)
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Quote */}
        <Typography 
          variant="h6" 
          sx={{ 
            mt: 8,
            color: "#000000",
            fontStyle: "italic",
            fontWeight: "500",
            textAlign: "center",
            maxWidth: "800px",
            mx: "auto"
          }}
        >
          "I started in 7th grade and achieved this before 18 — now it's your turn."
        </Typography>
      </Container>
    </Box>
  )
}

export default About
