const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Course description is required']
  },
  instructor: {
    type: String,
    required: [true, 'Instructor name is required']
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: String,
    required: [true, 'Course duration is required']
  },
  level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  category: {
    type: String,
    required: [true, 'Course category is required']
  },
  thumbnail: {
    type: String,
    default: 'default-course.jpg'
  },
  whatYouWillLearn: {
    type: [String],
    required: [true, 'Course learning outcomes are required']
  },
  requirements: {
    type: [String],
    required: [true, 'Course requirements are required']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for thumbnail URL
courseSchema.virtual('thumbnailUrl').get(function() {
  if (!this.thumbnail) return '/images/default-course.jpg';
  
  if (this.thumbnail.startsWith('http')) return this.thumbnail;
  
  return `/uploads/${this.thumbnail}`;
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;