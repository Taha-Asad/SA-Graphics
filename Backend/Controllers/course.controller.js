const Course = require('../models/Course.model');
const { validateMongoDbId } = require('../utils/validateMongodbId');
const asyncHandler = require('express-async-handler');

// Create a new course
const createCourse = asyncHandler(async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    res.json(newCourse);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all courses
const getAllCourses = asyncHandler(async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true });
    res.json(courses);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single course
const getCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const course = await Course.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }
    res.json(course);
  } catch (error) {
    throw new Error(error);
  }
});

// Update a course
const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedCourse) {
      throw new Error('Course not found');
    }
    res.json(updatedCourse);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a course
const deleteCourse = asyncHandler(async (req, res) => {
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
});

module.exports = {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse
}; 