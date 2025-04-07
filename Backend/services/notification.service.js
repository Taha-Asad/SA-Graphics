const nodemailer = require('nodemailer');
const Settings = require('../models/settings.model.js');
const ejs = require('ejs');
const path = require('path');

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  // Configure your email service here
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

class NotificationService {
  static async shouldSendNotification(type) {
    const settings = await Settings.findOne();
    return settings?.enableNotifications || false;
  }

  static async sendEmailNotification(template, data, subject) {
    try {
      if (!await this.shouldSendNotification('email')) {
        return;
      }

      const settings = await Settings.findOne();
      const adminEmail = settings?.contactEmail;

      if (!adminEmail) {
        console.error('Admin email not configured in settings');
        return;
      }

      const templatePath = path.join(__dirname, '../views/emails', `${template}.ejs`);
      const html = await ejs.renderFile(templatePath, data);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: subject,
        html: html
      });

      console.log(`Email notification sent: ${subject}`);
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  static async notifyNewOrder(orderData) {
    await this.sendEmailNotification(
      'newOrderNotification',
      { order: orderData },
      'New Order Received'
    );
  }

  static async notifyNewReview(reviewData) {
    await this.sendEmailNotification(
      'newReviewNotification',
      { review: reviewData },
      'New Review Received'
    );
  }

  static async notifyNewTestimonial(testimonialData) {
    await this.sendEmailNotification(
      'newTestimonialNotification',
      { testimonial: testimonialData },
      'New Testimonial Received'
    );
  }

  static async notifyContactForm(contactData) {
    await this.sendEmailNotification(
      'contactFormNotification',
      { contact: contactData },
      'New Contact Form Submission'
    );
  }
}

module.exports = NotificationService; 