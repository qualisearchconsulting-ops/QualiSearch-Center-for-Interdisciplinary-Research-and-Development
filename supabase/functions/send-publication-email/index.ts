// supabase/functions/send-publication-email/index.ts
// ══════════════════════════════════════════════════════════════
// Supabase Edge Function — Send Publication Certificate Emails
// ──────────────────────────────────────────────────────────────
// Sends personalized publication notification emails with
// certificate images to authors and peer reviewers.
//
// Environment Variables Required:
//   RESEND_API_KEY — Your Resend API key (https://resend.com)
//   SENDER_EMAIL   — Verified sender email (e.g. noreply@qualisearch.com)
//
// Deploy:
//   supabase functions deploy send-publication-email
// ══════════════════════════════════════════════════════════════

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const SENDER_EMAIL = Deno.env.get('SENDER_EMAIL') || 'QualiSearch Academic Press <onboarding@resend.dev>';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  recipientEmail: string;
  recipientName: string;
  recipientRole: 'author' | 'reviewer';
  articleTitle: string;
  articleDoi: string;
  articleUrl: string;
  journalName: string;
  publicationDate: string;
  certificateBase64: string; // data:image/png;base64,... 
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: EmailRequest | EmailRequest[] = await req.json();
    const recipients = Array.isArray(body) ? body : [body];

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY not configured. Set it via: supabase secrets set RESEND_API_KEY=re_xxxxx' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    for (const recipient of recipients) {
      const {
        recipientEmail,
        recipientName,
        recipientRole,
        articleTitle,
        articleDoi,
        articleUrl,
        journalName,
        publicationDate,
        certificateBase64,
      } = recipient;

      // Convert base64 data URL to raw base64
      const base64Data = certificateBase64.replace(/^data:image\/png;base64,/, '');

      // Build the email HTML
      const emailHtml = buildEmailHtml({
        recipientName,
        recipientRole,
        articleTitle,
        articleDoi,
        articleUrl,
        journalName,
        publicationDate,
      });

      const subject = recipientRole === 'reviewer'
        ? `Certificate of Peer Review — ${journalName}`
        : `Certificate of International Publication — ${journalName}`;

      // Send via Resend API
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: SENDER_EMAIL,
          to: [recipientEmail],
          subject: subject,
          html: emailHtml,
          attachments: [
            {
              filename: `Certificate_${recipientName.replace(/\s+/g, '_')}.png`,
              content: base64Data,
              content_type: 'image/png',
            },
          ],
        }),
      });

      const resendData = await resendRes.json();

      results.push({
        email: recipientEmail,
        name: recipientName,
        role: recipientRole,
        success: resendRes.ok,
        resendId: resendData.id || null,
        error: resendRes.ok ? null : (resendData.message || resendData.error || 'Unknown error'),
      });
    }

    const allSuccess = results.every((r) => r.success);

    return new Response(
      JSON.stringify({
        success: allSuccess,
        message: allSuccess
          ? `Successfully sent ${results.length} email(s).`
          : `Sent ${results.filter((r) => r.success).length}/${results.length} email(s). Some failed.`,
        results,
      }),
      {
        status: allSuccess ? 200 : 207,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// ──────────────────────────────────────
// Email HTML Template
// ──────────────────────────────────────
function buildEmailHtml({
  recipientName,
  recipientRole,
  articleTitle,
  articleDoi,
  articleUrl,
  journalName,
  publicationDate,
}: {
  recipientName: string;
  recipientRole: string;
  articleTitle: string;
  articleDoi: string;
  articleUrl: string;
  journalName: string;
  publicationDate: string;
}): string {
  const greeting = recipientRole === 'reviewer'
    ? `Dear ${recipientName},\n\nThank you for your invaluable contribution as a peer reviewer.`
    : `Dear ${recipientName},\n\nCongratulations on the publication of your research article!`;

  const bodyText = recipientRole === 'reviewer'
    ? `We are pleased to inform you that the article you reviewed has been successfully published in the <strong>${journalName}</strong>. Your rigorous evaluation helped ensure the quality and integrity of this research. Attached is your <strong>Certificate of Peer Review</strong>.`
    : `We are delighted to inform you that your article has been successfully published in the <strong>${journalName}</strong>. Attached is your <strong>Certificate of International Publication</strong>.`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#0e1629; font-family:'Georgia','Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0e1629; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 30px rgba(0,0,0,0.3);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0e1629,#16213a); padding:35px 40px; text-align:center;">
              <h1 style="color:#d6b25e; font-size:28px; margin:0 0 8px; font-family:'Georgia',serif; letter-spacing:2px;">
                QualiSearch Academic Press
              </h1>
              <p style="color:rgba(214,178,94,0.7); font-size:13px; margin:0; letter-spacing:1px; text-transform:uppercase;">
                Advancing Knowledge. Improving Education.
              </p>
            </td>
          </tr>

          <!-- Gold divider -->
          <tr>
            <td style="background:#d6b25e; height:3px; font-size:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 20px;">
              <p style="color:#2a1f0e; font-size:16px; line-height:1.7; margin:0 0 20px;">
                ${greeting.replace(/\n/g, '<br>')}
              </p>
              <p style="color:#2a1f0e; font-size:16px; line-height:1.7; margin:0 0 25px;">
                ${bodyText}
              </p>
            </td>
          </tr>

          <!-- Article Details Box -->
          <tr>
            <td style="padding:0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f5ed; border:1px solid #e8dfc8; border-radius:8px; padding:25px;">
                <tr>
                  <td>
                    <p style="color:#8B6914; font-size:12px; text-transform:uppercase; letter-spacing:2px; margin:0 0 12px; font-weight:bold;">
                      Article Details
                    </p>
                    <p style="color:#2a1f0e; font-size:17px; font-weight:bold; margin:0 0 10px; line-height:1.4;">
                      ${articleTitle}
                    </p>
                    <p style="color:#5a4e3a; font-size:14px; margin:0 0 6px;">
                      <strong>Journal:</strong> ${journalName}
                    </p>
                    ${articleDoi ? `<p style="color:#5a4e3a; font-size:14px; margin:0 0 6px;">
                      <strong>DOI:</strong> <a href="${articleDoi.startsWith('http') ? articleDoi : 'https://doi.org/' + articleDoi}" style="color:#8B6914;">${articleDoi}</a>
                    </p>` : ''}
                    <p style="color:#5a4e3a; font-size:14px; margin:0;">
                      <strong>Published:</strong> ${publicationDate}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          ${articleUrl ? `
          <tr>
            <td style="padding:0 40px 35px; text-align:center;">
              <a href="${articleUrl}" style="display:inline-block; background:#d6b25e; color:#0e1629; text-decoration:none; padding:14px 35px; border-radius:6px; font-weight:bold; font-size:15px; letter-spacing:1px; text-transform:uppercase;">
                View Published Article
              </a>
            </td>
          </tr>
          ` : ''}

          <!-- Certificate Note -->
          <tr>
            <td style="padding:0 40px 30px;">
              <p style="color:#7a6f5a; font-size:14px; line-height:1.6; margin:0; text-align:center; font-style:italic;">
                📜 Your personalized certificate is attached to this email as a PNG image.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0e1629; padding:30px 40px; text-align:center;">
              <p style="color:rgba(214,178,94,0.7); font-size:13px; margin:0 0 8px;">
                QualiSearch Center for Interdisciplinary Research and Development
              </p>
              <p style="color:rgba(255,255,255,0.35); font-size:11px; margin:0;">
                Open Access · Crossref Member · Creative Commons BY 4.0
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
