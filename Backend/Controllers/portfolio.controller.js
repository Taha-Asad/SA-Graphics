const Portfolio = require('../models/portfolio.model.js');
const { PROJECTS_FOLDER } = require('../config/multer');
const { projectSchema } = require('../validations/portfolioValidation.js');
const createError = require('http-errors');
const path = require('path');

// Create Project
exports.createProject = async (req, res) => {
  try {
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        message: 'Image is required. Please upload an image file.' 
      });
    }

    const { title, description, category, skillsUsed, githubLink, liveLink } = req.body;

    // Parse skillsUsed if it's a string array
    let parsedSkills;
    try {
      parsedSkills = JSON.parse(skillsUsed);
    } catch (e) {
      // If parsing fails, assume it's a comma-separated string
      parsedSkills = skillsUsed.split(',').map(skill => skill.trim());
    }

    // Create project with image path (without leading slash)
    const project = new Portfolio({
      title,
      description,
      category,
      skillsUsed: parsedSkills,
      image: path.join(PROJECTS_FOLDER, req.file.filename).replace(/\\/g, '/'),
      githubLink,
      liveLink
    });

    // Save the project
    const savedProject = await project.save();

    // Transform the response to include full image URL
    const projectResponse = savedProject.toObject();
    projectResponse.image = `${req.protocol}://${req.get('host')}/${projectResponse.image}`;

    res.status(201).json({
      message: 'Project created successfully',
      project: projectResponse
    });
  } catch (err) {
    console.error('Project creation error:', err);
    res.status(500).json({ 
      message: 'Server Error', 
      error: err.message 
    });
  }
};

// Get All Projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Portfolio.find();
    
    // Transform projects to include full image URLs
    const projectsWithUrls = projects.map(project => {
      const projectObj = project.toObject();
      if (projectObj.image) {
        // Ensure consistent path format without leading slash
        const imagePath = projectObj.image.startsWith('/') 
          ? projectObj.image.substring(1) 
          : projectObj.image;
        projectObj.image = `${req.protocol}://${req.get('host')}/${imagePath}`;
      } else {
        projectObj.image = null;
      }
      return projectObj;
    });

    res.json(projectsWithUrls);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get Project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Portfolio.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Transform response to include full image URL
    const projectResponse = project.toObject();
    if (projectResponse.image) {
      // Ensure consistent path format without leading slash
      const imagePath = projectResponse.image.startsWith('/') 
        ? projectResponse.image.substring(1) 
        : projectResponse.image;
      projectResponse.image = `${req.protocol}://${req.get('host')}/${imagePath}`;
    } else {
      projectResponse.image = null;
    }

    res.json(projectResponse);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const { title, description, category, skillsUsed, githubLink, liveLink } = req.body;

    // Parse skillsUsed if provided
    let parsedSkills;
    if (skillsUsed) {
      try {
        parsedSkills = JSON.parse(skillsUsed);
      } catch (e) {
        // If parsing fails, assume it's a comma-separated string
        parsedSkills = skillsUsed.split(',').map(skill => skill.trim());
      }
    }

    const updateData = {
      title,
      description,
      category,
      skillsUsed: parsedSkills,
      githubLink,
      liveLink
    };

    // Only update image if new file is uploaded (without leading slash)
    if (req.file) {
      updateData.image = path.join(PROJECTS_FOLDER, req.file.filename).replace(/\\/g, '/');
    }

    const project = await Portfolio.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Transform response to include full image URL
    const projectResponse = project.toObject();
    if (projectResponse.image) {
      // Ensure consistent path format without leading slash
      const imagePath = projectResponse.image.startsWith('/') 
        ? projectResponse.image.substring(1) 
        : projectResponse.image;
      projectResponse.image = `${req.protocol}://${req.get('host')}/${imagePath}`;
    } else {
      projectResponse.image = null;
    }

    res.json({ 
      message: 'Project updated successfully', 
      project: projectResponse 
    });
  } catch (err) {
    console.error('Project update error:', err);
    res.status(500).json({ 
      message: 'Server Error', 
      error: err.message 
    });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Portfolio.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};