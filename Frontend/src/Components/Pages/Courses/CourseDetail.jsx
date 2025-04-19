import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Rating,
  Skeleton
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';

const CourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/api/courses/${id}`);
        console.log("Response : " , response.data)
        setCourse(response.data);
      } catch (error) {
        console.log("Error : " , error)
        toast.error('Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({
      ...course,
      type: 'course'
    });
    toast.success('Course added to cart');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} />
            <Skeleton variant="text" height={60} sx={{ mt: 2 }} />
            <Skeleton variant="text" height={30} width="60%" />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center">
          Course not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4}>
        {/* Left Column - Course Details */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              {course.title}
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Rating value={course.rating} readOnly precision={0.5} />
              <Typography variant="body2" color="text.secondary">
                ({course.enrolledStudents} students enrolled)
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Chip
                icon={<AccessTimeIcon />}
                label={course.duration}
              />
              <Chip
                icon={<SignalCellularAltIcon />}
                label={course.level}
              />
              <Chip
                icon={<PersonIcon />}
                label={`By ${course.instructor}`}
              />
            </Stack>

            <Typography variant="body1" paragraph>
              {course.description}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              What You'll Learn
            </Typography>
            <Grid container spacing={2}>
              {course.whatYouWillLearn.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h5" gutterBottom>
              Requirements
            </Typography>
            <List>
              {course.requirements.map((req, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <SchoolIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={req} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>

        {/* Right Column - Course Card */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              position: 'sticky',
              top: 100,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            }}
          >
            <CardContent>
              <Typography variant="h4" color="primary" gutterBottom>
                ${course.price}
              </Typography>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleAddToCart}
                sx={{ mb: 2 }}
              >
                Add to Cart
              </Button>

              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                30-Day Money-Back Guarantee
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  This course includes:
                </Typography>
                <List>
                  {[
                    'Full lifetime access',
                    'Access on mobile and TV',
                    'Certificate of completion',
                    'Downloadable resources'
                  ].map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Typography variant="body2" color="text.secondary" align="center">
                Share this course with others
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetail; 