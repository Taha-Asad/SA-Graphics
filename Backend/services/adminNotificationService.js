const { sendEmail } = require('../config/nodemailer');
const ejs = require('ejs');
const path = require('path');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sagraphics.com';

const sendAdminNotification = async (subject, template, data) => {
  try {
    const templatePath = path.join(__dirname, '../views/emails/admin', `${template}.ejs`);
    const html = await ejs.renderFile(templatePath, data);

    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `[Admin Notification] ${subject}`,
      html
    });

    console.log(`Admin notification sent: ${subject}`);
  } catch (error) {
    console.error('Error sending admin notification:', error);
    // Don't throw the error to prevent breaking the main flow
  }
};

// User Registration Notification
const sendUserRegistrationNotification = async (user) => {
  await sendAdminNotification(
    'New User Registration',
    'userRegistration',
    { user }
  );
};

// Order Notification
const sendOrderNotification = async (order) => {
  await sendAdminNotification(
    'New Order Placed',
    'newOrder',
    { order }
  );
};

// Review Notification
const sendReviewNotification = async (review) => {
  await sendAdminNotification(
    'New Review Posted',
    'newReview',
    { review }
  );
};

// Testimonial Notification
const sendTestimonialNotification = async (testimonial) => {
  await sendAdminNotification(
    'New Testimonial Posted',
    'newTestimonial',
    { testimonial }
  );
};

module.exports = {
  sendUserRegistrationNotification,
  sendOrderNotification,
  sendReviewNotification,
  sendTestimonialNotification
}; 