const Project = require('../models/portfolio.model.js');
const upload = require('../config/multer');
const { projectSchema } = require('../validations/portfolioValidation.js');

// Create Project with Image Upload
exports.createProject = [
  upload.single('image'),
  async (req, res) => {
    const { error } = projectSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, description, skillsUsed, category } = req.body;
    const image = req.file ? req.file.path : '';

    try {
      const project = new Project({ title, description, skillsUsed, category, image });
      await project.save();
      res.status(201).json({ message: 'Project created successfully', project });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  },
];

// Get All Projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get Project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Update Project with Image Upload
exports.updateProject = [
  upload.single('image'),
  async (req, res) => {
    const { error } = projectSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, description, skillsUsed, category } = req.body;
    const image = req.file ? req.file.path : req.body.image;

    try {
      const project = await Project.findByIdAndUpdate(
        req.params.id,
        { title, description, skillsUsed, category, image },
        { new: true }
      );
      if (!project) return res.status(404).json({ message: 'Project not found' });
      res.json({ message: 'Project updated successfully', project });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  },
];

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};