const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'khavyasakthi1@@gmail.com',       // your Gmail
    pass: 'celg pklj vbws eumr',        // your App Password (with or without spaces)
  },
});

app.post('/send-confirmation', async (req, res) => {
  const { toEmail, userName, restaurantName, date, time, seats, totalAmount, confirmationCode } = req.body;

  const mailOptions = {
    from: '"Restaurant Booking App" <your_email@gmail.com>',
    to: 'mhatrej0106@gmail.com',
    subject: `Booking Confirmed – ${restaurantName} 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
        <div style="background: #1a1a1a; padding: 24px; text-align: center;">
          <h2 style="color: white; margin: 0;">Booking Confirmed ✅</h2>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px;">Hi <strong>${userName}</strong>, your table has been booked!</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr><td style="padding: 8px; color: #666;">Restaurant</td><td style="padding: 8px; font-weight: bold;">${restaurantName}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding: 8px; color: #666;">Date</td><td style="padding: 8px;">${date}</td></tr>
            <tr><td style="padding: 8px; color: #666;">Time</td><td style="padding: 8px;">${time}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding: 8px; color: #666;">Guests</td><td style="padding: 8px;">${seats} persons</td></tr>
            <tr><td style="padding: 8px; color: #666;">Total Amount</td><td style="padding: 8px; font-weight: bold;">₹${totalAmount.toLocaleString()}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding: 8px; color: #666;">Confirmation Code</td><td style="padding: 8px; font-weight: bold; color: #2e7d32;">${confirmationCode}</td></tr>
          </table>
          <p style="margin-top: 24px; color: #888; font-size: 13px;">Please show this confirmation code at the restaurant. Enjoy your meal! 🍽️</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3001, () => console.log('📧 Email server running on port 3001'));