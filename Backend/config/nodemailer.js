const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || "tahaasad709@gmail.com",
      pass: process.env.EMAIL_PASS || "zaza lmod ccxn ygfw",
    },
    tls: {
      rejectUnauthorized: false, // Add this to prevent security errors
    },
  });

const sendEmail = async (options) => {
  try {
    await transporter.sendMail(options);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail, transporter };