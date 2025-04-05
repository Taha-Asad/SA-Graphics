const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  const itemsList = orderDetails.items
    .map(item => `${item.title} - Quantity: ${item.quantity} - Rs. ${item.price * item.quantity}`)
    .join('\n');

  const userMailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Order Confirmation - SA Graphics',
    html: `
      <h2>Thank you for your order!</h2>
      <p>Your order has been successfully placed.</p>
      
      <h3>Order Details:</h3>
      <p>Order ID: ${orderDetails._id}</p>
      <p>Total Amount: Rs. ${orderDetails.totalAmount}</p>
      
      <h3>Items:</h3>
      <pre>${itemsList}</pre>
      
      <h3>Delivery Address:</h3>
      <p>${orderDetails.deliveryAddress}</p>
      
      <h3>Payment Method:</h3>
      <p>${orderDetails.paymentMethod}</p>
      
      <p>We will process your order soon. You can track your order status in your account.</p>
      
      <p>Thank you for shopping with SA Graphics!</p>
    `
  };

  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Order Received - ${orderDetails._id}`,
    html: `
      <h2>New Order Received</h2>
      
      <h3>Order Details:</h3>
      <p>Order ID: ${orderDetails._id}</p>
      <p>Customer Email: ${userEmail}</p>
      <p>Total Amount: Rs. ${orderDetails.totalAmount}</p>
      
      <h3>Items:</h3>
      <pre>${itemsList}</pre>
      
      <h3>Delivery Address:</h3>
      <p>${orderDetails.deliveryAddress}</p>
      
      <h3>Payment Method:</h3>
      <p>${orderDetails.paymentMethod}</p>
      
      <p>Please process this order as soon as possible.</p>
    `
  };

  try {
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = {
  sendOrderConfirmationEmail
}; 