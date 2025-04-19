import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Rating,
  Chip,
  Stack,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import { AccessTime as AccessTimeIconMUI, SignalCellularAlt as SignalCellularAltIconMUI, Person as PersonIconMUI, Check as CheckIcon, Search as SearchIcon } from '@mui/icons-material';

const CoursesSection = () => {
  console.log('Environment Variables:', import.meta.env); // Debug: Log environment variables

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    level: 'all',
    priceRange: 'all'
  });
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const categories = ['all', 'Web Development', 'Graphic Design', 'Digital Marketing', 'UI/UX Design'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-1000', label: 'Under Rs. 1,000' },
    { value: '1000-5000', label: 'Rs. 1,000 - Rs. 5,000' },
    { value: '5000+', label: 'Above Rs. 5,000' }
  ];

  // Enhanced image URL handler with debugging
  const getImageUrl = (thumbnail) => {
    console.log('Original thumbnail value:', thumbnail);
    
    if (!thumbnail) {
      console.log('Using placeholder image');
      return '/images/placeholder.jpg';
    }
    
    if (thumbnail.startsWith('http')) {
      console.log('Using full HTTP URL:', thumbnail);
      return thumbnail;
    }
    
    // Remove any leading slashes or uploads/ prefixes
    const cleanPath = thumbnail.replace(/^\/+/, '').replace(/^uploads\//, '');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const finalUrl = `${baseUrl}/uploads/${cleanPath}`;
    
    console.log('Constructed image URL:', finalUrl);
    return finalUrl;
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log('Fetching courses...');
      
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/courses`;
      console.log('API Endpoint:', apiUrl);
      
      const response = await axios.get(apiUrl);
      console.log('API Response:', response.data);
      
      let coursesToSet = [];
      
      if (response.data && Array.isArray(response.data)) {
        coursesToSet = response.data;
      } else if (response.data && Array.isArray(response.data.courses)) {
        coursesToSet = response.data.courses;
      } else if (response.data && Array.isArray(response.data.data)) {
        coursesToSet = response.data.data;
      }

      const publishedCourses = coursesToSet.filter(course => course.isPublished);
      console.log('Published courses count:', publishedCourses.length);

      if (publishedCourses.length > 0) {
        setCourses(publishedCourses);
        setError(null);
      } else {
        console.log('No published courses found');
        setCourses([]);
        setError('No courses available at the moment.');
      }
    } catch (error) {
      console.error('Error fetching courses:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setCourses([]);
      setError('Unable to fetch courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Debug: Log course thumbnails when courses change
  useEffect(() => {
    if (courses.length > 0) {
      console.log('Course thumbnails:');
      courses.forEach(course => {
        console.log(`Course: ${course.title}`);
        console.log('Thumbnail:', course.thumbnail);
        console.log('Constructed URL:', getImageUrl(course.thumbnail));
        console.log('---');
      });
    }
  }, [courses]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filterCourses = (coursesToFilter) => {
    if (!Array.isArray(coursesToFilter)) {
      console.error('Courses is not an array:', coursesToFilter);
      return [];
    }
    
    return coursesToFilter.filter(course => {
      if (filters.search && !course.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      if (filters.category !== 'all' && course.category !== filters.category) {
        return false;
      }

      if (filters.level !== 'all' && course.level !== filters.level) {
        return false;
      }

      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max) {
          if (course.price < min || course.price > max) return false;
        } else {
          if (course.price < min) return false;
        }
      }

      return true;
    });
  };

  const handleOpenDialog = (course) => {
    console.log('Opening dialog for course:', course.title);
    setSelectedCourse(course);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    console.log('Closing course dialog');
    setOpenDialog(false);
    setSelectedCourse(null);
  };
  
  // Stable image URL generator to prevent re-renders
  const getStableImageUrl = (thumbnail) => {
    if (!thumbnail) {
      return '/images/placeholder.jpg';
    }
    
    if (thumbnail.startsWith('http')) {
      return thumbnail;
    }
    
    const cleanPath = thumbnail.replace(/^\/+/, '').replace(/^uploads\//, '');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${baseUrl}/uploads/${cleanPath}`;
  };

  const handleAddToCart = (course) => {
    console.log('Adding course to cart:', course.title);
    const cartItem = {
      _id: course._id,
      title: course.title,
      price: parseFloat(course.price),
      thumbnail: getStableImageUrl(course.thumbnail),
      type: 'course'  // Explicitly set type as course
    };
    console.log('Cart item being added:', cartItem);
    addToCart(cartItem);
    toast.success('Course added to cart');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const coursesToDisplay = Array.isArray(courses) ? courses : [];
  const filteredCourses = filterCourses(coursesToDisplay);

  return (
    <>
      <Box 
        component="section" 
        sx={{ 
          py: 8,
          backgroundColor: '#f8f9fa'
        }}
        id="courses"
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 6 }}>
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
              Featured Courses
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              data-aos="fade-up"
              data-aos-delay="100"
              sx={{ mb: 4 }}
            >
              Enhance your skills with our professional courses
            </Typography>
          </Box>

          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="search"
                label="Search Courses"
                fullWidth
                value={filters.search}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="category"
                label="Category"
                select
                fullWidth
                value={filters.category}
                onChange={handleFilterChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="level"
                label="Level"
                select
                fullWidth
                value={filters.level}
                onChange={handleFilterChange}
              >
                {levels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="priceRange"
                label="Price Range"
                select
                fullWidth
                value={filters.priceRange}
                onChange={handleFilterChange}
              >
                {priceRanges.map((range) => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={4}>
            {filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id} data-aos="fade-up" data-aos-delay="200">
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      opacity: 0,
                      transition: 'opacity 0.2s ease-in-out',
                      zIndex: -1
                    },
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      '&::after': {
                        opacity: 1
                      }
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={getImageUrl(course.thumbnail)}
                    alt={course.title}
                    sx={{ 
                      objectFit: 'cover',
                      backgroundColor: '#f5f5f5'
                    }}
                    loading="lazy"
                    onError={(e) => {
                      console.error('Failed to load image:', e.target.src);
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {course.title}
                    </Typography>
                    
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Rating value={course.rating} readOnly precision={0.5} size="small" />
                      <Typography variant="body2" color="text.secondary">
                        ({course.enrolledStudents} students)
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={course.duration}
                        size="small"
                      />
                      <Chip
                        icon={<SignalCellularAltIcon />}
                        label={course.level}
                        size="small"
                      />
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <PersonIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {course.instructor}
                      </Typography>
                    </Stack>

                    <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                      Rs. {course.price}
                    </Typography>

                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleAddToCart(course)}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleOpenDialog(course)}
                      >
                        Learn More
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }} data-aos="fade-up" data-aos-delay="300">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/courses')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              View All Courses
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Course Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        {selectedCourse && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">{selectedCourse.title}</Typography>
                <IconButton onClick={handleCloseDialog} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={getImageUrl(selectedCourse.thumbnail)}
                    alt={selectedCourse.title}
                    sx={{ borderRadius: 1, objectFit: 'cover' }}
                    onError={(e) => {
                      console.error('Failed to load dialog image:', e.target.src);
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={3}>
                    <Box>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Rating value={selectedCourse.rating} readOnly precision={0.5} />
                        <Typography variant="body2" color="text.secondary">
                          ({selectedCourse.enrolledStudents} students enrolled)
                        </Typography>
                      </Stack>
                    </Box>

                    <Stack direction="row" spacing={2}>
                      <Chip icon={<AccessTimeIcon />} label={selectedCourse.duration} />
                      <Chip icon={<SignalCellularAltIcon />} label={selectedCourse.level} />
                      <Chip icon={<PersonIcon />} label={`By ${selectedCourse.instructor}`} />
                    </Stack>

                    <Typography variant="body1">
                      {selectedCourse.description}
                    </Typography>

                    <Box>
                      <Typography variant="h6" gutterBottom>
                        What You'll Learn
                      </Typography>
                      <Grid container spacing={2}>
                        {selectedCourse.whatYouWillLearn.map((item, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <ListItem>
                              <ListItemIcon>
                                <CheckIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={item} />
                            </ListItem>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Requirements
                      </Typography>
                      <List>
                        {selectedCourse.requirements.map((req, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <SchoolIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={req} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    <Box>
                      <Typography variant="h4" color="primary" gutterBottom>
                        Rs. {selectedCourse.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        30-Day Money-Back Guarantee
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  handleAddToCart(selectedCourse);
                  handleCloseDialog();
                }}
              >
                Add to Cart
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default CoursesSection;