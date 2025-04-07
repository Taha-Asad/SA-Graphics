import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
  Link,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Launch as LaunchIcon } from '@mui/icons-material';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    category: '',
    githubUrl: '',
    liveUrl: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get the token from localStorage
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/portfolio', {
        headers: getAuthHeader()
      });
      setProjects(response.data || []);
      // Clear any previous error messages if the request is successful
      setError('');
    } catch (error) {
      if (error.response?.status === 401) {
        setError('You are not logged in! Please log in to get access.');
      } else {
        setError('Failed to fetch projects');
      }
      console.error('Error fetching projects:', error);
    }
  };

  const handleOpen = (project = null) => {
    if (project) {
      setSelectedProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        technologies: Array.isArray(project.skillsUsed) 
          ? project.skillsUsed.join(', ') 
          : project.technologies || '',
        category: project.category || '',
        githubUrl: project.githubLink || project.githubUrl || '',
        liveUrl: project.liveLink || project.liveUrl || '',
        image: null,
      });
    } else {
      setSelectedProject(null);
      setFormData({
        title: '',
        description: '',
        technologies: '',
        category: '',
        githubUrl: '',
        liveUrl: '',
        image: null,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProject(null);
    setFormData({
      title: '',
      description: '',
      technologies: '',
      category: '',
      githubUrl: '',
      liveUrl: '',
      image: null,
    });
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.technologies || !formData.category) {
        setError('Please fill in all required fields');
        return;
      }

      const formDataToSend = new FormData();
      
      // Convert technologies string to array and ensure it's not empty
      const technologiesArray = formData.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech !== '');

      if (technologiesArray.length === 0) {
        setError('Please enter at least one technology');
        return;
      }

      // Append all form data
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      
      // Send technologies as skillsUsed (this is what the server expects)
      formDataToSend.append('skillsUsed', JSON.stringify(technologiesArray));
      
      formDataToSend.append('category', formData.category);
      
      // Add links with proper field names
      if (formData.githubUrl) formDataToSend.append('githubLink', formData.githubUrl);
      if (formData.liveUrl) formDataToSend.append('liveLink', formData.liveUrl);
      
      // Check if image is provided and is a valid file
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      // Get the authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in! Please log in to get access.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Log the data being sent (for debugging)
      console.log('Form Data being sent:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Create a regular object for debugging
      const debugData = {
        title: formData.title,
        description: formData.description,
        skillsUsed: technologiesArray,
        category: formData.category,
        githubLink: formData.githubUrl || '',
        liveLink: formData.liveUrl || '',
      };
      console.log('Debug data:', debugData);

      if (selectedProject) {
        const response = await axios.put(
          `http://localhost:5000/api/v1/portfolio/${selectedProject._id}`,
          formDataToSend,
          { headers }
        );
        console.log('Update response:', response.data);
        setSuccess('Project updated successfully');
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/v1/portfolio',
          formDataToSend,
          { headers }
        );
        console.log('Create response:', response.data);
        setSuccess('Project created successfully');
      }
      
      fetchProjects();
      handleClose();
    } catch (error) {
      console.error('Error saving project:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.status === 401) {
        setError('You are not logged in! Please log in to get access.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 500) {
        setError('Server error. Please check if all required fields are filled correctly.');
      } else {
        setError('Failed to save project. Please try again.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`http://localhost:5000/api/v1/portfolio/${id}`, {
          headers: getAuthHeader()
        });
        setSuccess('Project deleted successfully');
        fetchProjects();
      } catch (error) {
        if (error.response?.status === 401) {
          setError('You are not logged in! Please log in to get access.');
        } else {
          setError('Failed to delete project');
        }
      }
    }
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Projects Management</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add New Project
        </Button>
      </Stack>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            error.includes('not logged in') && (
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => window.location.href = '/login'}
              >
                Login
              </Button>
            )
          }
        >
          {error}
        </Alert>
      )}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Technologies</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>URLs</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>
                  {Array.isArray(project.skillsUsed) 
                    ? project.skillsUsed.join(', ') 
                    : project.technologies}
                </TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>
                  {(project.githubLink || project.githubUrl) && (
                    <Link 
                      href={project.githubLink || project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                    >
                      GitHub <LaunchIcon sx={{ ml: 0.5, fontSize: 16 }} />
                    </Link>
                  )}
                  {(project.liveLink || project.liveUrl) && (
                    <Link 
                      href={project.liveLink || project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      Live Demo <LaunchIcon sx={{ ml: 0.5, fontSize: 16 }} />
                    </Link>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(project)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(project._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                name="title"
                label="Title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                required
              />
              <TextField
                name="technologies"
                label="Technologies (comma-separated)"
                value={formData.technologies}
                onChange={handleChange}
                fullWidth
                required
                helperText="Enter technologies separated by commas (e.g., React, Node.js, MongoDB)"
              />
              <TextField
                name="category"
                label="Category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="githubUrl"
                label="GitHub URL"
                value={formData.githubUrl}
                onChange={handleChange}
                fullWidth
                type="url"
                helperText="Enter the full URL (e.g., https://github.com/username/project)"
              />
              <TextField
                name="liveUrl"
                label="Live Demo URL"
                value={formData.liveUrl}
                onChange={handleChange}
                fullWidth
                type="url"
                helperText="Enter the full URL (e.g., https://project-demo.com)"
              />
              <input
                accept="image/*"
                id="project-image"
                type="file"
                name="image"
                onChange={handleChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="project-image">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                >
                  {selectedProject ? 'Change Project Image' : 'Upload Project Image'}
                </Button>
              </label>
              {formData.image && (
                <Typography variant="caption">
                  Selected file: {formData.image.name}
                </Typography>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedProject ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Projects; 