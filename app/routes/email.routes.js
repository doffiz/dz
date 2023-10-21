const express = require('express');
const router = express.Router();
const transporter = require('../config/email.config'); // Import the email transporter

router.post('/email', async (req, res) => {
  const { fullName, hotelName, email, phoneNumber } = req.body;

  // Email message
  const mailOptions = {
    from: 'your.email@gmail.com', // Sender email
    to: 'recipient@example.com', // Recipient email
    subject: 'New Contact Form Submission',
    text: `
      Full Name: ${fullName}
      Hotel Name: ${hotelName}
      Email: ${email}
      Phone Number: ${phoneNumber}
    `,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

module.exports = router;