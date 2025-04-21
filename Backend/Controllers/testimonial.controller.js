const { sendTestimonialNotification } = require('../services/adminNotificationService');

const createTestimonial = async (req, res) => {
  try {
    const { error } = validateTestimonial(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }

    const { name, content, position, company, rating } = req.body;
    let image = null;

    if (req.file) {
      image = req.file.filename;
    }

    // Create new testimonial
    const testimonial = new Testimonial({
      name,
      content,
      position,
      company,
      rating,
      image
    });

    await testimonial.save();

    // Send admin notification
    await sendTestimonialNotification(testimonial);

    res.status(201).json({
      status: 'success',
      message: 'Testimonial created successfully',
      data: {
        testimonial
      }
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create testimonial'
    });
  }
}; 