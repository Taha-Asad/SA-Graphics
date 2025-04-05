import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  Fade,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import AddTestimonial from "./AddTestimonial";
import { Link } from "react-router-dom";

// Animation and transition constants
const ANIMATION_DURATION = 800; // ms
const AUTOPLAY_DELAY = 6000; // ms
const HOVER_SCALE = 1.05;

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return Boolean(token);
};

const url = "http://localhost:5000/api/v1/testimonials";

const Testimonials = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleTestimonialSubmitted = () => {
    handleCloseModal();
    // Refresh testimonials
    fetchApi();
  };

  const fetchApi = async () => {
    try {
      const response = await axios.get(url);
      setTestimonials(response.data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setError("Failed to load testimonials.");
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  useEffect(() => {
    let interval;
    if (autoplay && testimonials.length > 3 && !isTransitioning) {
      interval = setInterval(() => {
        handleNext();
      }, AUTOPLAY_DELAY);
    }
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length, currentIndex, isTransitioning]);

  const handleTransitionStart = () => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), ANIMATION_DURATION);
  };

  const handleNext = () => {
    if (!isTransitioning) {
      handleTransitionStart();
      setCurrentIndex((prevIndex) =>
        testimonials.length <= 3 ? 0 : (prevIndex + 1) % (testimonials.length - 2)
      );
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) {
      handleTransitionStart();
      setCurrentIndex((prevIndex) =>
        testimonials.length <= 3
          ? 0
          : (prevIndex - 1 + testimonials.length - 2) % (testimonials.length - 2)
      );
    }
  };

  const handleIndicatorClick = (index) => {
    if (!isTransitioning && index !== currentIndex) {
      handleTransitionStart();
      setCurrentIndex(index);
      setAutoplay(false);
    }
  };

  return (
    <Box
      id="testimonials"
      sx={{
        bgcolor: "#F4FAFD",
        position: "relative",
        padding: { xs: "60px 0", md: "80px 0" },
        overflow: "hidden",
      }}
      data-aos="fade-up"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          sx={{
            position: "relative",
            fontFamily: "Raleway",
            fontWeight: "600",
            mb: { xs: "80px", md: "50px" },
            fontSize: { xs: "2rem", md: "2.5rem" },
            "&::after": {
              content: '""',
              position: "absolute",
              width: { xs: "80px", md: "120px" },
              height: "3px",
              backgroundColor: "#149ddd",
              bottom: "-10px",
              left: { xs: "45px", md: "5.5%" },
              transform: "translateX(-50%)",
            },
          }}
          data-aos="fade-down"
        >
          Testimonials
        </Typography>
        <Typography variant="body1" component="div" sx={{
          fontFamily: "Raleway",
          fontWeight: "500",
          mb: "80px",
        }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi non veritatis quam distinctio? Id fugit quaerat nisi accusamus eum iste harum blanditiis quos libero quo ea aut
        </Typography>
        <Box sx={{ position: "relative", minHeight: { xs: "400px", md: "300px" } }}>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{
              transform: isTransitioning ? "scale(0.98)" : "scale(1)",
              opacity: isTransitioning ? 0.7 : 1,
              transition: `all ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          >
            {loading ? (
              <Grid item xs={12} textAlign="center">
                <CircularProgress size={40} sx={{ color: "#149ddd" }} />
              </Grid>
            ) : error ? (
              <Grid item xs={12} textAlign="center">
                <Typography color="error">{error}</Typography>
              </Grid>
            ) : testimonials.length === 0 ? (
              <Grid item xs={12} textAlign="center">
                <Typography color="text.secondary" variant="h6" fontFamily="Raleway" fontWeight="600">
                  No testimonials available. Be the first to write one!
                </Typography>
              </Grid>
            ) : (
              testimonials
                .slice(currentIndex, currentIndex + 3)
                .map((testimonial, index) => (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    key={testimonial._id || index}
                    sx={{
                      transition: `all ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                      transform: `translateX(${isTransitioning ? (index - 1) * 20 : 0}px)`,
                      opacity: isTransitioning ? 0.8 : 1,
                    }}
                    data-aos-delay={index * 200}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0px 2px 15px rgba(0,0,0,0.08)",
                        borderRadius: "15px",
                        overflow: "visible",
                        position: "relative",
                        pt: 4,
                        transform: "translateY(0)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: `translateY(-8px) scale(${HOVER_SCALE})`,
                          boxShadow: "0px 8px 25px rgba(0,0,0,0.15)",
                        },
                      }}
                      data-aos="fade-up" data-aos-delay={index * 200}
                    >
                      <Avatar
                        src={testimonial.userId?.profilePic}
                        alt={testimonial.userId?.name}
                        sx={{
                          width: { xs: 70, md: 80 },
                          height: { xs: 70, md: 80 },
                          position: "absolute",
                          top: -40,
                          left: "50%",
                          transform: "translateX(-50%)",
                          border: "6px solid #fff",
                          boxShadow: "0px 2px 15px rgba(0,0,0,0.1)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateX(-50%) scale(1.1)",
                          },
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, textAlign: "center", pt: 5 }}>
                        <Typography
                          variant="h6"
                          component="div"
                          fontFamily="Raleway"
                          sx={{
                            mb: 1,
                            color: "#333",
                            fontWeight: "600",
                            fontSize: { xs: "1.1rem", md: "1.25rem" },
                          }}
                        >
                          {testimonial.userId?.name || "Anonymous"}
                        </Typography>
                        {testimonial.jobTitle && (
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            fontFamily="Raleway"
                            sx={{
                              mb: 2,
                              fontSize: { xs: "0.9rem", md: "1rem" },
                              fontWeight: "500",
                            }}
                          >
                            {testimonial.jobTitle}
                          </Typography>
                        )}
                        <Box sx={{ position: "relative", px: { xs: 3, md: 4 } }}>
                          <FaQuoteLeft
                            size={isMobile ? 16 : 20}
                            color="#149ddd"
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              opacity: 0.8,
                            }}
                          />
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                              fontStyle: "italic",
                              lineHeight: 1.6,
                              fontSize: { xs: "0.9rem", md: "1rem" },
                              my: 2,
                            }}
                          >
                            {testimonial.text}
                          </Typography>
                          <FaQuoteRight
                            size={isMobile ? 16 : 20}
                            color="#149ddd"
                            style={{
                              position: "absolute",
                              right: 0,
                              bottom: 0,
                              opacity: 0.8,
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
            )}
          </Grid>

          {testimonials.length > 3 && (
            <>
              <IconButton
                onClick={handlePrev}
                disabled={isTransitioning}
                sx={{
                  position: "absolute",
                  left: { xs: -10, sm: -20, md: -50 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "white",
                  width: { xs: 35, md: 45 },
                  height: { xs: 35, md: 45 },
                  boxShadow: "0px 2px 15px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#149ddd",
                    color: "white",
                    transform: "translateY(-50%) scale(1.1)",
                  },
                  "&:disabled": {
                    bgcolor: "#f5f5f5",
                    color: "#bdbdbd",
                  },
                }}
              >
                <MdNavigateBefore size={isMobile ? 20 : 24} />
              </IconButton>
              <IconButton
                onClick={handleNext}
                disabled={isTransitioning}
                sx={{
                  position: "absolute",
                  right: { xs: -10, sm: -20, md: -50 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "white",
                  width: { xs: 35, md: 45 },
                  height: { xs: 35, md: 45 },
                  boxShadow: "0px 2px 15px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#149ddd",
                    color: "white",
                    transform: "translateY(-50%) scale(1.1)",
                  },
                  "&:disabled": {
                    bgcolor: "#f5f5f5",
                    color: "#bdbdbd",
                  },
                }}
              >
                <MdNavigateNext size={isMobile ? 20 : 24} />
              </IconButton>

              <Stack
                direction="row"
                spacing={1.5}
                justifyContent="center"
                sx={{
                  mt: { xs: 3, md: 4 },
                  pb: 2,
                }}
              >
                {Array.from({ length: Math.max(0, testimonials.length - 2) }).map(
                  (_, index) => (
                    <Box
                      key={index}
                      onClick={() => handleIndicatorClick(index)}
                      sx={{
                        width: { xs: 6, md: 8 },
                        height: { xs: 6, md: 8 },
                        borderRadius: "50%",
                        bgcolor: currentIndex === index ? "#149ddd" : "#ccc",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        opacity: currentIndex === index ? 1 : 0.5,
                        transform: currentIndex === index ? "scale(1.2)" : "scale(1)",
                        "&:hover": {
                          transform: "scale(1.3)",
                          bgcolor: currentIndex === index ? "#149ddd" : "#999",
                        },
                      }}
                    />
                  )
                )}
              </Stack>
            </>
          )}
        </Box>

        {loggedIn ? (
          <Box
            textAlign="center"
            mt={8}
            sx={{
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
              }
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              mb={2}
              sx={{
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                fontWeight: 500,
              }}
            >
              Want to share your experience?
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleOpenModal}
              sx={{
                borderRadius: "30px",
                px: { xs: 3, md: 4 },
                py: { xs: 1.2, md: 1.5 },
                textTransform: "none",
                fontSize: { xs: "1rem", md: "1.1rem" },
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
              Add Your Testimonial
            </Button>
          </Box>
        ) : (
          <Box
            textAlign="center"
            mt={8}
            sx={{
              opacity: 0.9,
              transform: 'translateY(0)',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              mb={2}
              sx={{
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                fontWeight: 500,
              }}
            >
              Want to share your experience?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              mb={3}
              sx={{
                fontSize: { xs: "0.9rem", md: "1rem" },
                opacity: 0.8,
              }}
            >
              Please log in to add your testimonial
            </Typography>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/login"
              sx={{
                borderRadius: "30px",
                px: { xs: 3, md: 4 },
                py: { xs: 1.2, md: 1.5 },
                textTransform: "none",
                fontSize: { xs: "1rem", md: "1.1rem" },
                borderColor: "#149ddd",
                color: "#149ddd",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  borderColor: "#1180b9",
                  backgroundColor: "rgba(20, 157, 221, 0.04)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Log In to Add Testimonial
            </Button>
          </Box>
        )}
      </Container>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 400 }}
        PaperProps={{
          sx: {
            borderRadius: '15px',
            overflow: 'hidden',
            transform: 'scale(0.95)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            m: { xs: 2, sm: 3, md: 4 },
            maxHeight: { xs: '90vh', sm: '85vh' },
            '&.MuiDialog-paper': {
              '&.MuiDialog-paperEnter': {
                transform: 'scale(1)',
              },
            },
          }
        }}
      >
        <DialogContent sx={{ p: 0, height: '100%', overflow: 'auto' }}>
          <AddTestimonial onClose={handleCloseModal} onSubmitted={handleTestimonialSubmitted} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Testimonials;