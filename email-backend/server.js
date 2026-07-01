require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
// Increase JSON payload limit to handle base64 images
app.use(express.json({ limit: '10mb' }));

// Create the email transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.BREVO_SMTP_LOGIN, // e.g., b08455001@smtp-brevo.com
    pass: process.env.BREVO_SMTP_KEY    // The SMTP key you just generated
  }
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to Brevo SMTP:', error);
  } else {
    console.log('Server is ready to send emails via Brevo SMTP');
  }
});

// Send Email Endpoint
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, html, attachments } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Process attachments from base64 (if any)
    const formattedAttachments = attachments ? attachments.map(att => ({
      filename: att.filename,
      content: att.content,
      encoding: 'base64'
    })) : [];

    const mailOptions = {
      from: `"QualiSearch Academic Press" <${process.env.BREVO_SENDER_EMAIL || process.env.BREVO_SMTP_LOGIN}>`,
      to: to.join(', '), // Nodemailer expects a comma-separated string for multiple recipients
      subject: subject,
      html: html,
      attachments: formattedAttachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);

    res.status(200).json({ message: 'Email sent successfully', id: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message || 'Failed to send email' });
  }
});

// Health check endpoint for Render
app.get('/', (req, res) => {
  res.send('QualiSearch Email Server is running.');
});

app.listen(PORT, () => {
  console.log(`Email backend listening on port ${PORT}`);
});
