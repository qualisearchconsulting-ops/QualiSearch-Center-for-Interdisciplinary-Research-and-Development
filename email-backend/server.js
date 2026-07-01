require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { GoogleGenAI } = require('@google/genai');

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

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const schema = {
      type: "OBJECT",
      properties: {
        title: { type: "STRING" },
        authors: { type: "STRING" },
        journal: { type: "STRING" },
        doi: { type: "STRING" },
        keywords: { type: "STRING" },
        abstract: { type: "STRING" },
        summary: { type: "STRING" },
        volume: { type: "STRING" },
        issue: { type: "STRING" },
        issn: { type: "STRING" },
        publisher: { type: "STRING" },
        copyright: { type: "STRING" },
        funding: { type: "STRING" },
        received: { type: "STRING" },
        revised: { type: "STRING" },
        accepted: { type: "STRING" },
        published: { type: "STRING" },
        references: { type: "STRING", description: "One reference per line" }
      }
    };

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: pdfBase64, mimeType: mimeType || 'application/pdf' } },
            { text: "You are an expert academic data extractor. Read this PDF article and extract the required fields exactly as they appear. Return only a valid JSON object matching the provided schema. Do not include markdown formatting or backticks around the JSON." }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
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
