const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'YourEmailService', // e.g., 'Gmail'
  auth: {
    user: 'your.email@gmail.com',
    pass: 'your-email-password',
  },
});

module.exports = transporter;