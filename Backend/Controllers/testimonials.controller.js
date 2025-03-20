const Testimonial = require('../models/testimonial.model.js');
const { testimonialSchema } = require('../validations/testimonialValidation.js');

// Submit Testimonial
exports.submitTestimonial = async (req, res) => {
  const { error } = testimonialSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { text } = req.body;
  try {
    const testimonial = new Testimonial({ userId: req.user.id, text });
    await testimonial.save();
    res.status(201).json({ message: 'Testimonial submitted for approval', testimonial });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get All Testimonials (Admin Only)
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: 'pending' }).populate('userId', 'name');
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Approve/Reject Testimonial (Admin Only)
exports.updateTestimonialStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ message: `Testimonial ${status}`, testimonial });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};