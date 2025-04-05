const createError = require('http-errors');
const Support = require('../models/support.model');

// Create a new support ticket
exports.createSupportTicket = async (req, res, next) => {
  try {
    const { subject, message, email } = req.body;

    if (!subject || !message || !email) {
      return next(createError(400, 'Please provide all required fields'));
    }

    const ticket = await Support.create({
      user: req.user._id,
      subject,
      message,
      email,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: ticket
    });
  } catch (error) {
    next(createError(500, 'Error creating support ticket'));
  }
};

// Get all support tickets for a user
exports.getUserTickets = async (req, res, next) => {
  try {
    const tickets = await Support.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tickets
    });
  } catch (error) {
    next(createError(500, 'Error fetching support tickets'));
  }
};

// Get all support tickets (admin only)
exports.getAllTickets = async (req, res, next) => {
  try {
    const tickets = await Support.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tickets
    });
  } catch (error) {
    next(createError(500, 'Error fetching support tickets'));
  }
};

// Update ticket status (admin only)
exports.updateTicketStatus = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { status, adminResponse } = req.body;

    const ticket = await Support.findById(ticketId);

    if (!ticket) {
      return next(createError(404, 'Support ticket not found'));
    }

    ticket.status = status;
    if (adminResponse) {
      ticket.adminResponse = adminResponse;
    }
    await ticket.save();

    res.json({
      success: true,
      message: 'Ticket status updated successfully',
      data: ticket
    });
  } catch (error) {
    next(createError(500, 'Error updating ticket status'));
  }
}; 