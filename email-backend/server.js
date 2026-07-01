require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
// Increase JSON payload limit to handle base64 images
app.use(express.json({ limit: '10mb' }));

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

// PDF Extraction Endpoint using Gemini 1.5 Flash
app.post('/api/extract-pdf', async (req, res) => {
  try {
    const { pdfBase64, mimeType } = req.body;
    
    if (!pdfBase64 || !process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'Missing PDF payload or GEMINI_API_KEY' });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        authors: { type: SchemaType.STRING },
        doi: { type: SchemaType.STRING },
        summary: { type: SchemaType.STRING },
        keywords: { type: SchemaType.STRING },
        funding: { type: SchemaType.STRING },
        received: { type: SchemaType.STRING },
        accepted: { type: SchemaType.STRING },
        published: { type: SchemaType.STRING },
        detailsObj: {
          type: SchemaType.OBJECT,
          properties: {
            volume: { type: SchemaType.STRING },
            issue: { type: SchemaType.STRING },
            issn: { type: SchemaType.STRING },
            publisher: { type: SchemaType.STRING },
            copyright: { type: SchemaType.STRING }
          }
        }
      }
    };

    const prompt = `
    Extract the following information from the provided academic journal article PDF.
    For 'authors', create a comma-separated list of all authors.
    For 'keywords', create a comma-separated list of keywords.
    For 'summary', write a brief 2-3 sentence abstract/summary.
    If a field is not found, leave it as an empty string.
    Return the output exactly matching the JSON schema provided.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const response = await model.generateContent([
      {
        inlineData: {
          data: pdfBase64,
          mimeType: mimeType || "application/pdf"
        }
      },
      prompt
    ]);

    const text = response.response.text();
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
