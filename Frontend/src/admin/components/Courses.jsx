import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  Stack,
  CircularProgress,
  Alert,
  Chip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    price: '',
    duration: '',
    level: 'Beginner',
    thumbnail: '',
    whatYouWillLearn: '',
    requirements: '',
    category: '',
    isPublished: true
  });

  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const categories = ['Web Development', 'Graphic Design', 'Digital Marketing', 'UI/UX Design'];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/v1/admin/courses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Admin courses response:', response.data);
      setCourses(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching courses:', error.response || error);
      setError('Failed to fetch courses');
      toast.error('Error loading courses: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (course = null) => {
    if (course) {
      setFormData({
        ...course,
        whatYouWillLearn: Array.isArray(course.whatYouWillLearn) 
          ? course.whatYouWillLearn.join('\\n') 
          : course.whatYouWillLearn,
        requirements: Array.isArray(course.requirements)
          ? course.requirements.join('\\n')
          : course.requirements
      });
      setSelectedCourse(course);
    } else {
      setFormData({
        title: '',
        description: '',
        instructor: '',
        price: '',
        duration: '',
        level: 'Beginner',
        thumbnail: '',
        whatYouWillLearn: '',
        requirements: '',
        category: '',
        isPublished: true
      });
      setSelectedCourse(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourse(null);
    setImageFile(null);
  };

  const handleOpenDeleteDialog = (course) => {
    setSelectedCourse(course);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedCourse(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const courseData = new FormData();
      
      // Convert isPublished to string 'true' or 'false'
      const processedFormData = {
        ...formData,
        isPublished: String(Boolean(formData.isPublished)),
        price: parseFloat(formData.price) || 0
      };
      
      // Log the data being processed
      console.log('Processing course data:', processedFormData);
      
      // Append all form data
      Object.keys(processedFormData).forEach(key => {
        if (key === 'whatYouWillLearn' || key === 'requirements') {
          const items = processedFormData[key].split('\\n').filter(item => item.trim());
          courseData.append(key, JSON.stringify(items));
        } else {
          courseData.append(key, processedFormData[key]);
        }
      });

      // Log the final form data
      console.log('Sending course data:', Object.fromEntries(courseData.entries()));

      // Append image if selected
      if (imageFile) {
        courseData.append('thumbnail', imageFile);
      }

      if (selectedCourse) {
        const response = await axios.put(
          `http://localhost:5000/api/v1/admin/courses/${selectedCourse._id}`,
          courseData,
          {
            headers: { 
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('Update response:', response.data);
        toast.success('Course updated successfully');
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/v1/admin/courses',
          courseData,
          {
            headers: { 
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('Create response:', response.data);
        toast.success('Course created successfully');
      }

      handleCloseDialog();
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error.response || error);
      toast.error(error.response?.data?.message || 'Error saving course: ' + error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      if (!selectedCourse?._id) {
        throw new Error('Invalid course ID');
      }

      // Log the complete request details
      console.log('Delete request details:', {
        url: `http://localhost:5000/api/v1/admin/courses/${selectedCourse._id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        courseId: selectedCourse._id,
        courseTitle: selectedCourse.title
      });

      const response = await axios.delete(
        `http://localhost:5000/api/v1/admin/courses/${selectedCourse._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Delete response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });

      toast.success('Course deleted successfully');
      handleCloseDeleteDialog();
      fetchCourses();
    } catch (error) {
      // Enhanced error logging
      console.error('Detailed error information:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      let errorMessage = 'Error deleting course: ';
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Unknown error occurred';
      }
      
      toast.error(errorMessage);
    }
  };

  const handleTogglePublish = async (course) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/v1/admin/courses/${course._id}/toggle-publish`,
        { isPublished: !course.isPublished },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchCourses();
      toast.success(`Course ${course.isPublished ? 'unpublished' : 'published'} successfully`);
    } catch (error) {
      console.error('Error toggling course status:', error.response || error);
      toast.error('Error toggling course status: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Manage Courses
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Course
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Price (Rs.)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.category}</TableCell>
                <TableCell>{course.level}</TableCell>
                <TableCell>{course.duration}</TableCell>
                <TableCell>{course.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={course.isPublished ? 'Published' : 'Draft'}
                    color={course.isPublished ? 'success' : 'default'}
                    onClick={() => handleTogglePublish(course)}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(course)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(course)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Course Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedCourse ? 'Edit Course' : 'Add New Course'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Course Title"
                  fullWidth
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="category"
                  label="Category"
                  fullWidth
                  required
                  select
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="instructor"
                  label="Instructor"
                  fullWidth
                  required
                  value={formData.instructor}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="price"
                  label="Price"
                  fullWidth
                  required
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="duration"
                  label="Duration"
                  fullWidth
                  required
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="level"
                  label="Level"
                  fullWidth
                  required
                  select
                  value={formData.level}
                  onChange={handleInputChange}
                >
                  {levels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mt: 1 }}
                >
                  Upload Thumbnail
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {imageFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected file: {imageFile.name}
                  </Typography>
                )}
                {!imageFile && formData.thumbnail && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Current thumbnail: {formData.thumbnail}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="whatYouWillLearn"
                  label="What You'll Learn (One item per line)"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={formData.whatYouWillLearn}
                  onChange={handleInputChange}
                  helperText="Enter each learning point on a new line"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="requirements"
                  label="Requirements (One item per line)"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={formData.requirements}
                  onChange={handleInputChange}
                  helperText="Enter each requirement on a new line"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                      name="isPublished"
                      color="primary"
                    />
                  }
                  label="Publish Course"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedCourse ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedCourse?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Courses;
