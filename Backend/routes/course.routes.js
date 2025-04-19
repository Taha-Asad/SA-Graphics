const express = require('express');
const router = express.Router();
const Course = require('../models/course.model');

// const { validateMongoDbId } = require('../utils/validateMongodbId');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'course-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Create a new course with thumbnail upload
router.post('/', upload.single('thumbnail'), asyncHandler(async (req, res) => {
  try {
    const courseData = req.body;
    
    if (req.file) {
      courseData.thumbnail = req.file.filename;
    }
    
    const newCourse = await Course.create(courseData);
    res.status(201).json(newCourse);
  } catch (error) {
    throw new Error(error);
  }
}));

// Get all published courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select('-__v')
      .sort({ createdAt: -1 });

    // Transform courses to include proper image URLs
    const transformedCourses = courses.map(course => {
      const courseObj = course.toObject();
      
      // Handle the thumbnail URL
      if (courseObj.thumbnail) {
        // If it's already a full URL, keep it
        if (!courseObj.thumbnail.startsWith('http')) {
          // Ensure the path uses forward slashes and starts with uploads/
          courseObj.thumbnail = courseObj.thumbnail.replace(/\\/g, '/');
          if (!courseObj.thumbnail.startsWith('uploads/')) {
            courseObj.thumbnail = `uploads/${courseObj.thumbnail}`;
          }
        }
      } else {
        courseObj.thumbnail = 'uploads/default-course.jpg';
      }

      return courseObj;
    });

    res.json({ 
      success: true,
      courses: transformedCourses 
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
});

// Get a single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      isPublished: true
    }).select('-__v');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Transform the course to include proper image URL
    const courseObj = course.toObject();
    if (courseObj.thumbnail && !courseObj.thumbnail.startsWith('http')) {
      courseObj.thumbnail = courseObj.thumbnail.replace(/\\/g, '/');
      if (!courseObj.thumbnail.startsWith('uploads/')) {
        courseObj.thumbnail = `uploads/${courseObj.thumbnail}`;
      }
    }

    res.json({
      success: true,
      course: courseObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
      error: error.message
    });
  }
});

// Update course with optional thumbnail update
router.put('/:id', upload.single('thumbnail'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  
  try {
    const updateData = req.body;
    
    if (req.file) {
      updateData.thumbnail = req.file.filename;
    }
    
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!updatedCourse) {
      throw new Error('Course not found');
    }
    
    res.json(updatedCourse);
  } catch (error) {
    throw new Error(error);
  }
}));

// Delete a course
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  
  try {
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      throw new Error('Course not found');
    }
    res.json(deletedCourse);
  } catch (error) {
    throw new Error(error);
  }
}));

module.exports = router;