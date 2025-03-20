const Order = require("../models/Order.model.js");
const User = require("../models/user.model.js");
const Book = require("../models/book.model.js");
const sendEmail = require("../config/nodemailer.js");
const ejs = require("ejs");
const path = require("path");
const { orderSchema } = require("../validations/orderValidation.js");

// Create Order
exports.createOrder = async (req, res) => {
  const { error } = orderSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { items, shippingAddress, paymentMethod } = req.body;
  try {
    // Validate books in the order
    for (const item of items) {
      const book = await Book.findById(item.bookId);
      if (!book)
        return res
          .status(404)
          .json({ message: `Book not found: ${item.bookId}` });
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
    if (!user) return res.status(404).json({ message: "User not found" });

    // Send order confirmation email to user
    const templatePath = path.join(
      __dirname,
      "../views/emails/orderConfirmation.ejs"
    );
    const html = await ejs.renderFile(templatePath, { order });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Order Confirmation",
      html,
    };

    await sendEmail(mailOptions);

    // Notify admin of new order
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Order Received",
      html: `<h1>New Order Received</h1><p>Order ID: ${order._id}</p>`,
    };

    await sendEmail(adminMailOptions);

    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Process Payment
exports.processPayment = async (req, res) => {
  const { orderId, token } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Simulate payment processing
    order.paymentStatus = "completed";
    await order.save();

    res.json({ message: "Payment successful", order });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Fetch user email
    const user = await User.findById(order.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Send status update email to user
    const templatePath = path.join(
      __dirname,
      "../views/emails/orderStatusUpdate.ejs"
    );
    const html = await ejs.renderFile(templatePath, { order });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Order Status Update",
      html,
    };

    await sendEmail(mailOptions);

    res.json({ message: "Order status updated successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
