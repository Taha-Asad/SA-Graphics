import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";

const AddTestimonial = ({ onClose, onSubmitted }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [text, setText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validation
    if (text.trim().length < 10) {
      setError("Testimonial must be at least 10 characters long");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        onClose();
        return;
      }

      await axios.post(
        "http://localhost:5000/api/v1/testimonials",
        { 
          text: text.trim(),
          jobTitle: jobTitle.trim() 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Thank you! Your testimonial has been submitted for review.");
      onSubmitted();
    } catch (error) {
      console.error("Error adding testimonial:", error);
      setError(
        error.response?.data?.message ||
          "Failed to submit testimonial. Please try again."
      );
      toast.error("Failed to submit testimonial. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 1,
          color: '#666',
          transition: 'all 0.3s ease',
          '&:hover': {
            color: '#149ddd',
            transform: 'rotate(90deg)',
          }
        }}
      >
        <MdClose size={24} />
      </IconButton>
      <Fade in={showContent} timeout={600}>
        <Box
          sx={{
            p: { xs: 3, sm: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            height: '100%',
            overflow: 'auto',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              textAlign: "center",
              fontWeight: 600,
              color: "#333",
              mb: 3,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "60px",
                height: "3px",
                backgroundColor: "#149ddd",
              },
            }}
          >
            Share Your Experience
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                width: '100%',
                animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
                '@keyframes shake': {
                  '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
                  '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
                  '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
                  '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
                }
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              label="Your Job Title"
              fullWidth
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              variant="outlined"
              placeholder="e.g. Software Engineer, Designer, Manager"
              sx={{
                mb: 3,
                transition: 'all 0.3s ease',
                "& .MuiOutlinedInput-root": {
                  transition: 'all 0.3s ease',
                  "&:hover fieldset": {
                    borderColor: "#149ddd",
                    transform: 'translateY(-2px)',
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#149ddd",
                    boxShadow: '0 0 0 2px rgba(20, 157, 221, 0.1)',
                  },
                },
                "&:hover": {
                  transform: 'translateY(-2px)',
                }
              }}
            />

            <TextField
              label="Your Testimonial"
              fullWidth
              multiline
              rows={isMobile ? 4 : 6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              variant="outlined"
              placeholder="Share your experience with us..."
              sx={{
                mb: 3,
                transition: 'all 0.3s ease',
                "& .MuiOutlinedInput-root": {
                  transition: 'all 0.3s ease',
                  "&:hover fieldset": {
                    borderColor: "#149ddd",
                    transform: 'translateY(-2px)',
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#149ddd",
                    boxShadow: '0 0 0 2px rgba(20, 157, 221, 0.1)',
                  },
                },
                "&:hover": {
                  transform: 'translateY(-2px)',
                }
              }}
              error={!!error}
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                borderRadius: "30px",
                textTransform: "none",
                fontSize: { xs: "1rem", sm: "1.1rem" },
                backgroundColor: "#149ddd",
                boxShadow: "0px 4px 15px rgba(20, 157, 221, 0.25)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "#1180b9",
                  boxShadow: "0px 6px 20px rgba(20, 157, 221, 0.35)",
                  transform: "translateY(-2px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                "&.Mui-disabled": {
                  transform: "none",
                }
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit Testimonial"}
            </Button>
          </form>
        </Box>
      </Fade>
    </Box>
  );
};

export default AddTestimonial;
