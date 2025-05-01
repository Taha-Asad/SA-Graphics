import { Box, Button, Container, Grid, Paper, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import { MdLocationPin, MdEmail, MdPhone } from 'react-icons/md'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const url = "http://localhost:5000/api/v1/contact"

const Contact = () => {
  const [message, setMessage] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const newError = {};
    if (!message.name) newError.name = "Name is required";
    if (!message.email) newError.email = "Email is required";
    if (!message.subject) newError.subject = "Subject is required";
    if (!message.message) newError.message = "Message is required";

    setError(newError);

    if (Object.keys(newError).length > 0) return;

    try {
      const response = await axios.post(url, message);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to send message");
      }
      toast.success("Message sent successfully!");
      setMessage({ name: "", email: "", subject: "", message: "" });
      setError({});
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Something went wrong");
    }
  };
  const [hoveredIndex, setHoveredIndex] = useState(0)

  return (
    <Box
      id="contact"
      sx={{
        bgcolor: "#F5F5F5",
        position: "relative",
        padding: { xs: "40px 0", md: "60px 0" },
        marginBottom: { xs: "120px", md: "90px" },
        overflow: "hidden",
        width: "100%",
      }}
      data-aos="fade-up"
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          sx={{
            position: "relative",
            fontWeight: "600",
            mb: { xs: "60px", md: "80px" },
            fontSize: { xs: "2rem", md: "2.5rem" },
            "&::after": {
              content: '""',
              position: "absolute",
              width: { xs: "50px", md: "80px" },
              height: "3px",
              backgroundColor: "#149ddd",
              bottom: "-10px",
              left: { xs: "30px", md: "3.8%" },
              transform: "translateX(-50%)",
            },
          }}
          data-aos="fade-down"
        >
          Contact
        </Typography>

        <Grid container spacing={4}>
          {/* Contact Form Column */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={3}
              component="form"
              onSubmit={handleOnSubmit}
            
              sx={{
                overflow: "hidden",
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
                p: { xs: 3, md: 4 },
                bgcolor: "#1B1F27", // updated background color
color: "#fff", // updated text color
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 0 30px rgba(0, 0, 0, 0.15)",
                  transform: "translateY(-5px)",
                },
              }}
              data-aos="fade-top"
            >
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: "#149DDD",
                }}
              >
                Send us a Message
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    id="name"
                    name="name"
                    placeholder='Enter your name'
                    autoComplete='off'
                    autoFocus
                    value={message.name}
                    onChange={handleChange}
                    error={!!error.name}
                    helperText={error.name}
                    fullWidth
                    InputLabelProps={{
                      style: { color: "#ccc" }, // Label color (e.g., "Name")
                    }}
                    InputProps={{
                      style: { color: "#fff" }, // Text you type
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    id="email"
                    name="email"
                    placeholder='Enter your email'
                    autoComplete='off'
                    value={message.email}
                    onChange={handleChange}
                    error={!!error.email}
                    helperText={error.email}
                    fullWidth
                    InputLabelProps={{
                      style: { color: "#ccc" }, // Label color (e.g., "Name")
                    }}
                    InputProps={{
                      style: { color: "#fff" }, // Text you type
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Subject"
                    id="subject"
                    name='subject'
                    fullWidth
                    autoComplete='off'
                    value={message.subject}
                    onChange={handleChange}
                    error={!!error.subject}
                    helperText={error.subject}
                    InputLabelProps={{
                      style: { color: "#ccc" }, // Label color (e.g., "Name")
                    }}
                    InputProps={{
                      style: { color: "#fff" }, // Text you type
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Message"
                    id='message'
                    name='message'
                    fullWidth
                    multiline
                    rows={4}
                    value={message.message}
                    onChange={handleChange}
                    error={!!error.message}
                    helperText={error.message}
                    InputLabelProps={{
                      style: { color: "#ccc" }, // Label color (e.g., "Name")
                    }}
                    InputProps={{
                      style: { color: "#fff" }, // Text you type
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type='submit'
                    variant='contained'
                    sx={{
                      mt: 2,
                      width: { xs: "100%", sm: "auto" },
                      borderRadius: "30px",
                      px: 4,
                      py: 1.2,
                      textTransform: "none",
                      fontSize: "1.1rem",
                      backgroundColor: "#149ddd",
                      boxShadow: "0px 4px 15px rgba(20, 157, 221, 0.25)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        backgroundColor: "#1180b9",
                        boxShadow: "0px 6px 20px rgba(20, 157, 221, 0.35)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Contact Info Column */}
          <Grid item xs={12} md={5}>
          <Paper
    elevation={3}
    sx={{
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
        p: { xs: 3, md: 4 },
        height: "100%",
        transition: "all 0.3s ease",
        bgcolor: "#1B1F27", // updated background color
        color: "#fff", // updated text color
        "&:hover": {
            boxShadow: "0 0 30px rgba(0, 0, 0, 0.15)",
            transform: "translateY(-5px)",
        },
    }}
    data-aos="fade-down"
>
        <Typography
            variant="h5"
            component="h3"
            sx={{
                mb: 3,
                fontWeight: 600,
                color: "#149DDD",
            }}
        >
            Contact Information
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box
                onMouseEnter={() => setHoveredIndex(1)}
                onMouseLeave={() => setHoveredIndex(null)}
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ borderRadius: "50%", padding: "10px", transition: "all 0.7s ease", color: hoveredIndex === 1 ? "#fff" : "#149DDD", bgcolor: hoveredIndex === 1 ? "#149DDD" : "#F4FAFD", border: hoveredIndex === 1 ? "1px solid transparent" : "1px solid #149ddd" }}>
                <MdLocationPin size={24} />
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Address
                    </Typography>
                    <Typography variant="body1" >
                        123 Main St, Anytown, USA
                    </Typography>
                </Box>
            </Box>

            <Box
                onMouseEnter={() => setHoveredIndex(2)}
                onMouseLeave={() => setHoveredIndex(null)}
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ borderRadius: "50%", padding: "10px", transition: "all 0.7s ease", color: hoveredIndex === 2 ? "#fff" : "#149DDD", bgcolor: hoveredIndex === 2 ? "#149DDD" : "#F4FAFD", border: hoveredIndex === 2 ? "1px solid transparent" : "1px solid #149ddd" }}>
                    <MdEmail size={24} />
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Email
                    </Typography>
                    <Typography variant="body1">
                        info@example.com
                    </Typography>
                </Box>
            </Box>

            <Box
                onMouseEnter={() => setHoveredIndex(3)}
                onMouseLeave={() => setHoveredIndex(null)}
                sx={{ display: 'flex', alignItems: 'center', gap: 2, }}>
                <Box sx={{ borderRadius: "50%", padding: "10px", transition: "all 0.7s ease", color: hoveredIndex === 3 ? "#fff" : "#149DDD", bgcolor: hoveredIndex === 3 ? "#149DDD" : "#F4FAFD", border: hoveredIndex === 3 ? "1px solid transparent" : "1px solid #149ddd" }}>
                    <MdPhone size={24} />
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }} >
                        Phone
                    </Typography>
                    <Typography variant="body1">
                        +92 325 9881310
                    </Typography>
                </Box>
            </Box>
        </Box>
    </Paper>
</Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Contact