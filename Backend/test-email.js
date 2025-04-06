require('dotenv').config();
const { sendEmail } = require('./config/nodemailer');
const ejs = require('ejs');
const path = require('path');

async function testEmail() {
  try {
    // Create a test review object
    const testReview = {
      user: {
        name: 'Test User',
        email: 'test@example.com'
      },
      rating: 5,
      comment: 'This is a test review to verify email notifications are working correctly.',
      book: {
        title: 'Test Book'
      },
      createdAt: new Date()
    };

    // Render the email template
    const templatePath = path.join(__dirname, 'views/emails/newReviewNotification.ejs');
    const html = await ejs.renderFile(templatePath, { review: testReview });

    // Send the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Test Review Notification Email',
      html
    };

    await sendEmail(mailOptions);
    console.log('Test email sent successfully!');
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

// Run the test
testEmail(); 