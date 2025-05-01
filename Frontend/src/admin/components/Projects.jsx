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
  Chip,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Launch as LaunchIcon } from '@mui/icons-material';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    category: '',
    githubUrl: '',
    liveUrl: '',
    image: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/v1/portfolio');
        setProjects(response.data || []);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Handle dialog open
  const handleOpen = (project = null) => {
    setSelectedProject(project);
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        technologies: Array.isArray(project.skillsUsed) 
          ? project.skillsUsed.join(', ') 
          : '',
        category: project.category || '',
        githubUrl: project.githubLink || '',
        liveUrl: project.liveLink || '',
        image: null
      });
      setImagePreview(project.image || '');
    } else {
      setFormData({
        title: '',
        description: '',
        technologies: '',
        category: '',
        githubUrl: '',
        liveUrl: '',
        image: null
      });
      setImagePreview('');
    }
    setOpen(true);
  };

  // Handle dialog close
  const handleClose = () => {
    setOpen(false);
    setSelectedProject(null);
    setError('');
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.technologies || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare form data
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      
      // Process technologies
      const technologies = formData.technologies.split(',').map(tech => tech.trim());
      formDataToSend.append('skillsUsed', JSON.stringify(technologies));
      
      if (formData.githubUrl) formDataToSend.append('githubLink', formData.githubUrl);
      if (formData.liveUrl) formDataToSend.append('liveLink', formData.liveUrl);
      
      // Add image if it exists
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Configure request
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      let response;
      if (selectedProject) {
        // Update existing project
        response = await axios.put(
          `http://localhost:5000/api/v1/portfolio/${selectedProject._id}`,
          formDataToSend,
          config
        );
        setSuccess('Project updated successfully');
      } else {
        // Create new project (require image)
        if (!formData.image) {
          throw new Error('Project image is required');
        }
        response = await axios.post(
          'http://localhost:5000/api/v1/portfolio',
          formDataToSend,
          config
        );
        setSuccess('Project created successfully');
      }

      // Refresh projects list
      const projectsResponse = await axios.get('http://localhost:5000/api/v1/portfolio');
      setProjects(projectsResponse.data || []);
      handleClose();

    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
    }
  };

  // Handle project deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        await axios.delete(`http://localhost:5000/api/v1/portfolio/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSuccess('Project deleted successfully');
        const projectsResponse = await axios.get('http://localhost:5000/api/v1/portfolio');
        setProjects(projectsResponse.data || []);

      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to delete project');
      }
    }
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Projects Management</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpen()}
          disabled={loading}
        >
          Add New Project
        </Button>
      </Stack>

      {/* Status messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          {error.includes('Authentication') && (
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => window.location.href = '/login'}
              sx={{ ml: 1 }}
            >
              Login
            </Button>
          )}
        </Alert>
      )}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Projects table */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Technologies</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Links</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                      {Array.isArray(project.skillsUsed) && project.skillsUsed.map((tech, index) => (
                        <Chip key={index} label={tech} size="small" />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>
                    {project.githubLink && (
                      <Link 
                        href={project.githubLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        GitHub <LaunchIcon sx={{ ml: 0.5, fontSize: 16 }} />
                      </Link>
                    )}
                    {project.liveLink && (
                      <Link 
                        href={project.liveLink} 
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
      )}

      {/* Project form dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProject ? 'Edit Project' : 'Add New Project'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
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
                label="Technologies (comma separated)"
                value={formData.technologies}
                onChange={handleChange}
                fullWidth
                required
                helperText="List technologies separated by commas (e.g., React, Node.js, MongoDB)"
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
              />
              
              <TextField
                name="liveUrl"
                label="Live Demo URL"
                value={formData.liveUrl}
                onChange={handleChange}
                fullWidth
                type="url"
              />
              
              {/* Image upload */}
              <input
                accept="image/*"
                id="project-image-upload"
                type="file"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="project-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                >
                  {selectedProject ? 'Change Project Image' : 'Upload Project Image'}
                </Button>
              </label>
              
              {/* Image preview */}
              {(imagePreview || formData.image) && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Image Preview:</Typography>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px',
                      marginTop: '8px',
                      display: 'block'
                    }}
                  />
                </Box>
              )}
              
              {/* Required field note for new projects */}
              {!selectedProject && (
                <Typography variant="caption" color="error">
                  * Image is required for new projects
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