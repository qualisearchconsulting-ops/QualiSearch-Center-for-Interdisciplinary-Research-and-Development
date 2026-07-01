require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_KEY
  }
});

async function testEmail() {
  try {
    const mailOptions = {
      from: `"QualiSearch Test" <${process.env.BREVO_SENDER_EMAIL || process.env.BREVO_SMTP_LOGIN}>`,
      to: 'qualisearchconsulting@gmail.com', // Replace with any email you want to test receiving
      subject: 'Test Email from Brevo SMTP Integration',
      html: '<h1>Success!</h1><p>If you are reading this, your Brevo SMTP integration is working perfectly in Node.js!</p>'
    };

    console.log('Sending test email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

testEmail();
