import { Box, Container, Grid, Typography } from '@mui/material'
import React from 'react'
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Skill from './Skill';
const Resume = () => {
  return (
    <>
      <Box id="resume" sx={{
        bgcolor: "#F4FAFD",
        position: "relative",
        marginTop: "-50px",
        padding: "20px 0",
        overflow: "hidden",
      }}
        data-aos="fade-up"
      >
        <Container

        >
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
          >Resume</Typography>
          <Typography variant="body1" component="div" sx={{
            fontFamily: "Raleway",
            fontWeight: "500",
            mb: "50px",
          }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi non veritatis quam distinctio? Id fugit quaerat nisi accusamus eum iste harum blanditiis quos libero quo ea aut voluptatem amet ut pariatur laboriosam, eaque in sunt saepe repellendus incidunt rerum molestiae aliquam! Quaerat tenetur dolor iusto repellendus eius, commodi in quo.
          </Typography>
          <Grid container spacing={2} direction="row">
            <Grid item xs={12} md={6} data-aos="fade-right">
              <Box>
                <Typography variant="h4" component="h4" fontFamily="Raleway" ml={"23px"} fontWeight="500">
                  Summary
                </Typography>
                <Timeline sx={{ marginLeft: "-90%" }}>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot variant='outlined' color='primary'></TimelineDot>
                      <TimelineConnector sx={{ bgcolor: "#149ddd" }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography 
                        variant="h6" 
                        component="div" 
                        color={"#6A6B6B"} 
                        fontSize={"25px"} 
                        fontFamily="Raleway"
                      >
                        Brandon
                      </Typography>
                      <Typography variant="body1" component="div" color={"#6A6B6B"} fontFamily={"Raleway"} fontSize={"19px"} fontStyle={"italic"}>
                        Innovative and deadline-driven Graphic Designer with 3+ years of experience designing and developing user-centered digital/print marketing material from initial concept to final, polished deliverable.
                      </Typography>
                      <ul style={{ listStyleType: "disc", fontFamily: "Raleway", fontSize: "19px", marginLeft: "30px", marginTop: "30px" }}>
                        <li style={{ marginBottom: "10px", color: "#6A6B6B" }}>Location</li>
                        <li style={{ marginBottom: "10px", color: "#6A6B6B" }}>+92 325 9881310</li>
                        <li style={{ marginBottom: "10px", color: "#6A6B6B" }}>tahaasd1123@gmail.com</li>
                      </ul>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
                <Typography variant="h4" component="h4" fontFamily="Raleway" mt={"40px"} ml={"23px"} fontWeight="500">
                  Education
                </Typography>
                <Timeline sx={{ marginLeft: "-90%" }}>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot variant='outlined' color='primary'></TimelineDot>
                      <TimelineConnector sx={{ bgcolor: "#149ddd" }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography 
                        variant="h6" 
                        component="div" 
                        fontSize={"25px"} 
                        color={"#6A6B6B"} 
                        fontFamily="Raleway"
                      >
                        Master of Fine Arts & Graphic Design
                      </Typography>
                      <span style={{ fontSize: "18px", marginLeft: "10px" }}><b>2015-2019</b></span>
                      <Typography variant="body1" component="div" fontSize={"19px"} fontFamily={"Raleway"} fontStyle={"italic"} mt={"10px"} color={"#6A6B6B"}>
                        Rochester Institute of Technology, Rochester, NY
                      </Typography>
                      <Typography variant="body1" component="div" fontSize={"19px"} fontFamily={"Raleway"} mt={"10px"} color={"#6A6B6B"}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum quasi voluptates nemo provident enim laboriosam accusantium aspernatur, eius quo sit facere ipsum voluptate repellendus perferendis.
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot variant='outlined' color='primary'></TimelineDot>
                      <TimelineConnector sx={{ bgcolor: "#149ddd" }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography 
                        variant="h6" 
                        component="div" 
                        fontSize={"25px"} 
                        color={"#6A6B6B"} 
                        fontFamily="Raleway"
                      >
                        Bachelor of Fine Arts & Graphic Design
                      </Typography>
                      <span style={{ fontSize: "18px", marginLeft: "10px" }}><b>2015-2019</b></span>
                      <Typography variant="body1" component="div" fontSize={"19px"} fontFamily={"Raleway"} fontStyle={"italic"} mt={"10px"} color={"#6A6B6B"}>
                        Rochester Institute of Technology, Rochester, NY
                      </Typography>
                      <Typography variant="body1" component="div" fontSize={"19px"} fontFamily={"Raleway"} mt={"10px"} color={"#6A6B6B"}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia rem atque omnis dolorum voluptatem ex obcaecati. Doloribus modi sint ab explicabo expedita, temporibus voluptate. Cupiditate?
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} data-aos="fade-left">
              <Box>
                <Typography variant="h4" component="h4" fontFamily="Raleway" ml={"24px"} fontWeight="500">
                  Professional Experience
                </Typography>
                <Timeline sx={{ marginLeft: "-90%" }}>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot variant='outlined' color='primary' />
                      <TimelineConnector sx={{ bgcolor: "#149ddd" }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography 
                        variant="h6" 
                        component="div" 
                        fontSize={"25px"} 
                        color={"#6A6B6B"} 
                        fontFamily="Raleway"
                      >
                        Senior Graphic Designer
                      </Typography>
                      <span style={{ fontSize: "18px", marginLeft: "10px" }}><b>2019-present</b></span>
                      <Typography variant="body1" component="div" fontSize={"19px"} fontFamily={"Raleway"} mt={"10px"} fontStyle={"italic"} color={"#6A6B6B"}>
                        Experion, New York, NY
                      </Typography>
                      <Typography variant="body1" component="div" fontSize={"19px"} fontFamily={"Raleway"} color={"black"}>
                        <ul style={{ listStyleType: "disc", fontFamily: "Raleway", fontSize: "19px", marginLeft: "30px", marginTop: "10px", color:"black"}}>
                          <li style={{ marginBottom: "10px", color: "#6A6B6B" }}>Lead in the design, development, and implementation of the graphic, layout, and production communication materials</li>
                          <li style={{ marginBottom: "10px", color: "#6A6B6B" }}>Delegate tasks to the 7 members of the design team and provide counsel on all aspects of the project.</li>
                          <li style={{ marginBottom: "10px", color: "#6A6B6B" }}>Supervise the assessment of all graphic materials in order to ensure quality and accuracy of the design</li>
                          <li style={{ marginBottom: "10px", color: "#6A6B6B" }}>Oversee the efficient use of production project budgets ranging from $2,000 - $25,000</li>
                        </ul>
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot variant='outlined' color='primary' />
                      <TimelineConnector sx={{ bgcolor: "#149ddd" }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography 
                        variant="h6" 
                        component="div" 
                        fontSize={"25px"} 
                        color={"#6A6B6B"} 
                        fontFamily="Raleway"
                      >
                        Graphic Designer
                      </Typography>
                      <span style={{ fontSize: "18px", marginLeft: "10px" }}><b>2015-2019</b></span>
                      <Typography variant="body1" component="div" fontSize={"19px"} fontFamily={"Raleway"} mt={"10px"} fontStyle={"italic"} color={"#6A6B6B"}>
                        Stepping Stone Advertising, New York, NY</Typography>
                      <Typography variant="body1" component="div" fontSize={"19px"} fontFamily={"Raleway"} color={"#6A6B6B"}>
                        <ul style={{ listStyleType: "disc", fontFamily: "Raleway", fontSize: "19px", marginLeft: "30px", marginTop: "10px" }}>
                          <li style={{ marginBottom: "10px", color: "#6A6B6B" }}>Developed numerous marketing programs (logos, brochures,infographics, presentations, and advertisements).
                          </li>
                          <li style={{ marginBottom: "10px", color: "#6A6B6B" }}>Managed up to 5 projects or tasks at a given time while under pressure</li>
                          <li style={{ marginBottom: "10px", color: "#6A6B6B" }}>Recommended and consulted with clients on the most appropriate graphic design</li>
                          <li style={{ marginBottom: "10px", color: "#6A6B6B" }}>Created 4+ design presentations and proposals a month for clients and account managers</li>
                        </ul>
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
          <Skill/>
    </>
  )
}

export default Resume