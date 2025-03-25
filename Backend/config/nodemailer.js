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
module.exports = transporter