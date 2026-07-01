require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const os = require('os');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
// Increase JSON payload limit to handle base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Nodemailer is removed because Render blocks SMTP port 587
// We will use Brevo REST API (HTTPS on port 443) instead


// Send Email Endpoint
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, html, attachments } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Format attachments for Brevo REST API
    const formattedAttachments = attachments ? attachments.map(att => ({
      name: att.filename,
      content: att.content // Base64 string without the data URI prefix
    })) : [];

    const payload = {
      sender: {
        name: "QualiSearch Academic Press",
        email: process.env.BREVO_SENDER_EMAIL
      },
      to: to.map(email => ({ email })),
      subject: subject,
      htmlContent: html,
      attachment: formattedAttachments.length > 0 ? formattedAttachments : undefined
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY, // Note: This needs an API key, not an SMTP key
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API Error:', errorData);
      return res.status(500).json({ error: errorData.message || 'Failed to send email via Brevo' });
    }

    const data = await response.json();
    console.log('Email sent:', data.messageId);

    res.status(200).json({ message: 'Email sent successfully', id: data.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message || 'Failed to send email' });
  }
});

// PDF Extraction Endpoint using Gemini 1.5 Flash (Text Prompt)
app.post('/api/extract-pdf', async (req, res) => {
  try {
    const { pdfBase64 } = req.body;
    
    if (!pdfBase64 || !process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'Missing PDF payload or GEMINI_API_KEY' });
    }

    // Parse the PDF locally first to extract its text
    const pdfParse = require('pdf-parse');
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    const parsedPdf = await pdfParse(pdfBuffer);
    const pdfText = parsedPdf.text;

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const prompt = `
    You are a data extractor. Extract the following information from the academic journal article text provided below.
    For 'authors', create a comma-separated list of all authors.
    For 'keywords', create a comma-separated list of keywords.
    For 'summary', write a brief 2-3 sentence abstract/summary.
    If a field is not found, leave it as an empty string.

    You MUST return ONLY a valid raw JSON object exactly matching this structure, and nothing else (no backticks, no markdown):
    {
      "title": "string",
      "authors": "string",
      "doi": "string",
      "summary": "string",
      "keywords": "string",
      "funding": "string",
      "received": "string",
      "accepted": "string",
      "published": "string",
      "detailsObj": {
        "volume": "string",
        "issue": "string",
        "issn": "string",
        "publisher": "string",
        "copyright": "string"
      }
    }

    --- ARTICLE TEXT ---
    ${pdfText.substring(0, 30000)} // Limit text to prevent exceeding context window if PDF is huge
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const response = await model.generateContent(prompt);

    let text = response.response.text();
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    res.status(200).json(JSON.parse(text));
  } catch (error) {
    console.error('Error extracting PDF:', error);
    res.status(500).json({ error: error.message || 'Failed to extract PDF data' });
  }
});

// Health check endpoint for Render
app.get('/', (req, res) => {
  res.send('QualiSearch Email Server is running.');
});

app.listen(PORT, () => {
  console.log(`Email backend listening on port ${PORT}`);
});
