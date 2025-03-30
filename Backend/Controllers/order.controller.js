const Order = require("../models/Order.model");
const User = require("../models/user.model");
const Book = require("../models/book.model");
const { sendEmail } = require("../config/nodemailer");
const ejs = require("ejs");
const path = require("path");
const createError = require('http-errors');

// Create Order
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Validate books in the order
    for (const item of items) {
      const book = await Book.findById(item.bookId);
      if (!book) {
        throw createError(404, `Book not found: ${item.bookId}`);
      }
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });
    await order.save();

    // Fetch user email
    const user = await User.findById(req.user.id);
    if (!user) throw createError(404, "User not found");

    // Send order confirmation email
    const templatePath = path.join(
      __dirname,
      "../views/emails/orderConfirmation.ejs"
    );
    const html = await ejs.renderFile(templatePath, { order });

    await sendEmail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Order Confirmation",
      html,
    });

    // Notify admin
    await sendEmail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Order Received",
      html: `<h1>New Order Received</h1><p>Order ID: ${order._id}</p>`,
    });

    res.status(201).json({ 
      status: 'success',
      data: {
        order 
      }
    });
  } catch (error) {
    next(error);
  }
};

// Process Payment
const processPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw createError(404, "Order not found");

    order.paymentStatus = "completed";
    await order.save();

    res.json({ 
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update Order Status
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) throw createError(404, "Order not found");

    const user = await User.findById(order.userId);
    if (!user) throw createError(404, "User not found");

    const templatePath = path.join(
      __dirname,
      "../views/emails/orderStatusUpdate.ejs"
    );
    const html = await ejs.renderFile(templatePath, { order });

    await sendEmail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Order Status Update",
      html,
    });

    res.json({ 
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get User Orders
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json({
      status: 'success',
      results: orders.length,
      data: {
        orders
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Order by ID
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw createError(404, "Order not found");
    
    res.json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  processPayment,
  updateOrderStatus,
  getUserOrders,
  getOrderById
};