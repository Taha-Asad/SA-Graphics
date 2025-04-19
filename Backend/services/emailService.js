const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOrderConfirmationEmail = async (order) => {
  const { shippingAddress, totalAmount, items, orderId } = order;
  
  const itemsList = items.map(item => 
    `- ${item.title} x ${item.quantity} - Rs. ${item.price * item.quantity}`
  ).join('\n');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: shippingAddress.email,
    subject: 'Order Confirmation - SA Graphics',
    html: `
      <h2>Thank you for your order!</h2>
      <p>Dear ${shippingAddress.name},</p>
      <p>Your order has been successfully placed and is currently under review.</p>
      
      <h3>Order Details:</h3>
      <p>Order ID: ${orderId}</p>
      <p>Total Amount: Rs. ${totalAmount}</p>
      
      <h3>Items:</h3>
      <pre>${itemsList}</pre>
      
      <h3>Shipping Address:</h3>
      <p>${shippingAddress.street}</p>
      <p>${shippingAddress.city}, ${shippingAddress.province} ${shippingAddress.postalCode}</p>
      <p>Phone: ${shippingAddress.phoneNo}</p>
      
      <p>We will notify you once your order has been approved and is being processed.</p>
      
      <p>Best regards,<br>SA Graphics Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

const sendOrderApprovalEmail = async (order) => {
  const { shippingAddress, totalAmount, items, orderId } = order;
  
  const itemsList = items.map(item => 
    `- ${item.title} x ${item.quantity} - Rs. ${item.price * item.quantity}`
  ).join('\n');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: shippingAddress.email,
    subject: 'Order Approved - SA Graphics',
    html: `
      <h2>Your order has been approved!</h2>
      <p>Dear ${shippingAddress.name},</p>
      <p>Great news! Your order has been approved and is now being processed.</p>
      
      <h3>Order Details:</h3>
      <p>Order ID: ${orderId}</p>
      <p>Total Amount: Rs. ${totalAmount}</p>
      
      <h3>Items:</h3>
      <pre>${itemsList}</pre>
      
      <h3>Shipping Address:</h3>
      <p>${shippingAddress.street}</p>
      <p>${shippingAddress.city}, ${shippingAddress.province} ${shippingAddress.postalCode}</p>
      <p>Phone: ${shippingAddress.phoneNo}</p>
      
      <p>Thank you for choosing SA Graphics!</p>
      
      <p>Best regards,<br>SA Graphics Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order approval email sent successfully');
  } catch (error) {
    console.error('Error sending order approval email:', error);
    throw error;
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendOrderApprovalEmail
}; 