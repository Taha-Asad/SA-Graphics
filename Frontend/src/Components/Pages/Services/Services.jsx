import React, { useState } from "react";
import { ServicesList } from "./servicesList";
import { Box, Card, CardMedia ,CardActionArea, CardContent, Container, Grid, Typography, useTheme, useMediaQuery } from "@mui/material";


const Services = () => {
    const [hoveredIndex, setHoveredIndex] = useState(0);
    const theme = useTheme();
    const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    return (
        <>
            <Box id="services" sx={{
                bgcolor: "#FAF4FD",
                position: "relative",
                overflow: "hidden",
                width: "100%",
                py: { xs: 5, sm: 8, md: 10 },
            }}
                data-aos="fade-up">
                <Container maxWidth="lg">
                    <Typography variant='h3' component="h2" sx={{
                        position: "relative",
                        fontFamily: "sans-serif",
                        fontWeight: "500",
                        mb: { xs: "30px", sm: "40px", md: "50px" },
                        fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            width: { xs: "80px", sm: "120px", md: "150px" },
                            height: "4px",
                            backgroundColor: "#149ddd",
                            bottom: "-10px",
                            left: { xs: "43px", sm: "78px" },
                            transform: "translateX(-50%)",
                        }
                    }}
                    >Services</Typography>
                    <Typography variant="body1" component="div" sx={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: "500",
                        mb: { xs: "30px", sm: "40px", md: "50px" },
                        px: { xs: 2, sm: 3, md: 0 },
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                    }}>
            At <b> SA GRAPHICS  <em>(Founder & CEO: Sheraz Amjad)</em></b>, we offer a complete range of creative services specializing in Print Design, Digital Design, Branding, and Advertising. Our print design solutions cover everything from eye-catching brochures, flyers, posters, and business cards to premium packaging and book covers — all crafted to perfection for professional printing. In the digital realm, we design highly engaging social media posts, thumbnails, banners, and ads that help brands grow their online presence and connect with their audience. Our branding services focus on building strong visual identities through unique logo design, brand style guides, and complete corporate stationery sets. Additionally, we create compelling advertising designs for both digital and print campaigns, helping businesses promote their products, services, and events with maximum impact. At SA GRAPHICS, we turn ideas into visuals that speak, engage, and inspire.
                    </Typography>
                    <Box>
                        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                            {ServicesList.map((service, index) => {
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={index} data-aos="fade-up" data-aos-delay={(index + 1) * 200}>
                                        <Card onMouseEnter={() => setHoveredIndex(index)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                            sx={{
                                                transition: "all 0.6s ease",
                                                boxShadow: hoveredIndex === index ? "0px 8px 30px rgba(20, 157, 221, 0.4)" : "0px 4px 15px rgba(20, 157, 221, 0.2)",
                                                bgcolor: "#fff",

                                                "&:hover": {
                                                    bgcolor: "#149ddd",
                                                },
                                            }}>
                                                <CardMedia sx={
                                                    {
                                                        height: { xs: "200px", sm: "250px", md: "180px" },
                                                    }
                                                }>
                                                    <img src={service.image} alt="" style={{
                                                        height: "220px",
                                                        width: "100%",
                                                    }}/>
                                                </CardMedia>
                                            <CardActionArea>
                                                <CardContent sx={{
                                                    height: { xs: "auto", sm: "45vh", md: "40vh" },
                                                    paddingTop: { xs: "30px", sm: "40px", md: "50px" },
                                                    minHeight: { xs: "250px", sm: "300px" },
                                                }}>
                                                        <Typography
                                                            variant="h5"
                                                            component="div"
                                                            fontWeight="600"
                                                            textAlign={"center"}
                                                            mt={1}
                                                            sx={{
                                                                
                                                                transition: "all 0.6s ease",
                                                                color: hoveredIndex === index ? "#ffff" : "#149DDD",
                                                                fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.25rem" },
                                                            }}
                                                        >
                                                            {service.title}
                                                        </Typography>
                                                    <Typography 
                                                        variant="body1" 
                                                        component="div" 
                                                        mt={2} 
                                                        textAlign={"center"}
                                                        sx={{
                                                            color: hoveredIndex === index ? "#ffff" : "#333",
                                                            fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                                                            lineHeight: { xs: 1.5, sm: 1.6, md: 1.7 },
                                                        }}
                                                    >
                                                        {service.description}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Box>
                </Container>
            </Box>
        </>
    )
}
export default Services;
