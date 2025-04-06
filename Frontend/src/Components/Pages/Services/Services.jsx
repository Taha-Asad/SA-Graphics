import React, { useState } from "react";
import { ServicesList } from "./servicesList";
import { Box, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material";


const Services = () => {
    const [hoveredIndex, setHoveredIndex] = useState(0);

    return (
        <>
            <Box id="services" sx={{
                bgcolor: "#FAF4FD",
                position: "relative",
                overflow: "hidden",
                width: "100%",
                py: 10,
            }}
                data-aos="fade-up">
                <Container>
                    <Typography variant='h3' component="h2" sx={{
                        position: "relative",
                        fontFamily: "Raleway",
                        fontWeight: "500",
                        mb: "50px",
                        "&::after": {
                            content: '""',  // Required for pseudo-elements
                            position: "absolute",
                            width: "150px",   // Adjust width as needed
                            height: "4px",   // Thickness of the line
                            backgroundColor: "#149ddd",  // Example color (orange)
                            bottom: "-10px",  // Spacing below text
                            left: "75px",
                            transform: "translateX(-50%)", // Centers the line
                        }
                    }}
                    >Services</Typography>
                    <Typography variant="body1" component="div" sx={{
                        fontFamily: "Raleway",
                        fontWeight: "500",
                        mb: "50px",
                    }}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid eligendi, enim nobis eum harum quibusdam facilis magnam iusto hic provident praesentium voluptatem officia quod quis quidem laboriosam ipsum ipsa eius tenetur eveniet! Voluptate placeat
                    </Typography>
                    <Box>
                        <Grid container spacing={2}>
                            {ServicesList.map((service, index) => {
                                return (
                                    <>
                                        <Grid item xs={12} sm={6} md={4} key={index} data-aos="fade-up" data-aos-delay={(index + 1) * 200}>
                                            <Card onMouseEnter={() => setHoveredIndex(index)}
                                                onMouseLeave={() => setHoveredIndex(null)}
                                                sx={{
                                                    transition: "all 0.6s ease",
                                                    boxShadow: hoveredIndex === index ? "0px 4px 20px rgba(0, 0, 0, 0.2)" : "none",
                                                    bgcolor: "#fff",
                                                    "&:hover": {
                                                        bgcolor: "#149ddd",
                                                    },
                                                }}>
                                                <CardActionArea >
                                                    <CardContent sx={{
                                                        height: "40vh",
                                                        padding: "50px",
                                                    }}>
                                                        <Box display={"flex"}>
                                                            <Typography 
                                                                variant="body1"
                                                                component="div"
                                                                sx={{
                                                                    display: "inline-block",
                                                                    padding: "10px",
                                                                    borderRadius: "50%",
                                                                    color: hoveredIndex === index ? "#149ddd" : "#fff",
                                                                    bgcolor: hoveredIndex === index ? "#fff" : "#149ddd",
                                                                    border: hoveredIndex === index ? "1px solid #149ddd" : "1px solid transparent",
                                                                    transition: "all 0.6s ease",
                                                                    fontSize: "25px",
                                                                }}>
                                                                {service.icon}
                                                            </Typography>
                                                            <Typography
                                                                variant="h6"
                                                                component="div"
                                                                ml={1}
                                                                fontWeight="500"
                                                                mt={1}
                                                                fontFamily="Raleway"
                                                                sx={{
                                                                    transition: "all 0.6s ease",
                                                                    color: hoveredIndex === index ? "#ffff" : "#149DDD"
                                                                }}
                                                            >
                                                                {service.title}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body1" component="div" mt={2} ml={2} textAlign={"center"}
                                                            color={hoveredIndex === index ? "#ffff" : "#333"}
                                                        >
                                                            {service.description}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>

                                        </Grid>
                                    </>
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
