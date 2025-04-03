const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
      },
      email: {
        type: String,
        required: [true, 'Please provide your email'],
        lowercase: true,
        validate: {
          validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
          message: 'Please provide a valid email address'
        }
      },
      subject:{
        type: String,
        required: [true, 'Please provide your subject'],
        trim: true,
        maxlength: [50, 'Subject cannot exceed 50 characters']
      },
      message: {
        type: String,
        required: [true, 'Please provide your message'],
        trim: true,
        maxlength: [500, 'Message cannot exceed 500 characters']
      },
})

module.exports = mongoose.model('Contact', contactSchema);