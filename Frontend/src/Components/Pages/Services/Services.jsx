import React, { useState } from "react";
import { ServicesList } from "./servicesList";
import { Box, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material";


const Services = () => {
    const [hoveredIndex, setHoveredIndex] = useState(0);

    return (
        <>
            <Box id="services" sx={{
                bgcolor: "#F5F5F5",
                position: "relative",
                padding: "80px 0",
                overflow: "hidden",
                width: "100%", // Ensures it doesn't exceed the viewport width
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
                    <Typography variant='p' component="h6" sx={{
                        fontFamily: "Raleway",
                        fontWeight: "500",
                        mb: "50px",
                    }}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi non veritatis quam distinctio? Id fugit quaerat nisi accusamus eum iste harum blanditiis quos libero quo ea aut voluptatem amet ut pariatur laboriosam, eaque in sunt saepe repellendus incidunt rerum molestiae aliquam! Quaerat tenetur dolor iusto repellendus eius, commodi in quo.
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
                                                            <Typography sx=
                                                                {{
                                                                    display: "inline-block",
                                                                    padding: "10px",
                                                                    borderRadius: "50%",
                                                                    color: hoveredIndex === index ? "#149ddd" : "#fff",
                                                                    bgcolor: hoveredIndex === index ? "#fff" : "#149ddd",
                                                                    border: hoveredIndex === index ? "1px solid #149ddd" : "1px solid transparent",
                                                                    transition: "all 0.6s ease",
                                                                    fontSize: "25px",
                                                                }}>
                                                                {service.icon}</Typography>
                                                            <Typography
                                                                ml={1} variant="h6" fontWeight={"500"}
                                                                mt={1}
                                                                fontFamily="Raleway"
                                                                transition={"all 0.6s ease"}
                                                                color={hoveredIndex === index ? "#ffff" : "#149DDD"} >
                                                                {service.title}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="p" mt={2} ml={2} textAlign={"center"} component={'h6'}
                                                            color={hoveredIndex === index ? "#ffff" : "black"}
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
