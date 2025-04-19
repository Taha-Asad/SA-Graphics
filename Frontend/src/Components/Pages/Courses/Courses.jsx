import React, { useState, useEffect, useCallback } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Grid, Container, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Memoized CourseCard component for better performance
const CourseCard = React.memo(({ course, onLearnMore }) => {
  // Use thumbnailUrl which is already properly formatted
  const imageUrl = React.useMemo(() => {
    // Debug logging
    console.log('Course thumbnail data:', {
      thumbnail: course.thumbnail,
      thumbnailUrl: course.thumbnailUrl
    });
    
    // Use the thumbnail path and prepend the backend URL
    return `http://localhost:5000${course.thumbnailUrl}`;
  }, [course.thumbnailUrl]);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 3
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={course.title}
        sx={{ objectFit: 'cover' }}
        onError={(e) => {
          console.error('Image load error for URL:', imageUrl);
          e.target.src = '/images/placeholder.jpg';
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}>
          {course.description}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            ${course.price}
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => onLearnMore(course)}
          >
            Learn More
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
});

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch courses from the backend
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:5000/api/v1/courses');
      console.log('Courses response:', response.data); // Debug log
      
      // Filter only published courses for non-admin users
      const publishedCourses = response.data.courses.filter(course => course.isPublished);
      setCourses(publishedCourses);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again later.');
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleLearnMore = useCallback((course) => {
    navigate(`/course/${course._id}`);
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchCourses} 
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Available Courses
      </Typography>
      
      <Grid container spacing={4}>
        {courses.map((course) => (
          <Grid item key={course._id} xs={12} sm={6} md={4}>
            <CourseCard 
              course={course} 
              onLearnMore={handleLearnMore}
            />
          </Grid>
        ))}
      </Grid>

      {courses.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">No courses available at the moment.</Typography>
        </Box>
      )}
    </Container>
  );
};

export default Courses; 