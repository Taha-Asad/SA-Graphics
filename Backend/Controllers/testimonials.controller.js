const Testimonial = require("../models/testimonial.model");

// Submit a Testimonial (User)
exports.submitTestimonial = async (req, res) => {
  try {
    const { text, jobTitle } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Testimonial text is required" });
    }

    const newTestimonial = new Testimonial({
      userId: req.user.id,
      text,
      jobTitle,
      status: "pending", // Default status is pending
    });

    await newTestimonial.save();
    res.status(201).json({
      message: "Testimonial submitted for approval",
      testimonial: newTestimonial,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Approved Testimonials (Public)
exports.getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: "approved" })
      .populate("userId", "name profilePic")
      .select("text jobTitle createdAt userId")
      .sort({ createdAt: -1 });

    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Testimonials (Admin Only)
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .populate("userId", "name profilePic")
      .select("text jobTitle createdAt userId status")
      .sort({ createdAt: -1 });

    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Approve or Reject a Testimonial (Admin Only)
exports.updateTestimonialStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const testimonialId = req.params.id;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      testimonialId,
      { status },
      { new: true }
    );

    if (!updatedTestimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json({
      message: `Testimonial ${status}`,
      testimonial: updatedTestimonial,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
