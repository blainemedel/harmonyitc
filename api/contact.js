// Gene - Nov, 24, 2026: Vercel Function handling Contact Hub inquiry submissions via Resend + Custom Metrics
import { metric } from '@vercel/functions';
import { CONTACT_DATA, SITE_META } from '../src/data/siteContent.js';
import { validateInquiryPayload, buildResendEmailPayload } from '../src/utils/contactInquiry.js';

export async function POST(request) {
  const validPriorityIds = CONTACT_DATA.briefBuilder.priorities.map((p) => p.id);

  let rawBody;
  try {
    rawBody = await request.json();
  } catch (_) {
    metric('contact.submissions', 1, { outcome: 'invalid_json' });
    return Response.json(
      { ok: false, error: 'Invalid JSON request body.' },
      { status: 400 }
    );
  }

  const validation = validateInquiryPayload(rawBody, validPriorityIds);

  if (validation.isSpam) {
    metric('contact.submissions', 1, { outcome: 'honeypot' });
    return Response.json({ ok: true, delivered: true });
  }

  if (!validation.ok) {
    metric('contact.submissions', 1, { outcome: 'validation_error' });
    return Response.json(
      {
        ok: false,
        error: 'Please review the highlighted fields.',
        fieldErrors: validation.errors
      },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL || SITE_META.email;

  if (!apiKey || !fromEmail) {
    metric('contact.submissions', 1, { outcome: 'not_configured' });
    return Response.json(
      {
        ok: false,
        code: 'NOT_CONFIGURED',
        error: 'Direct email delivery is not configured yet.'
      },
      { status: 503 }
    );
  }

  const emailPayload = buildResendEmailPayload({
    data: validation.data,
    priorityList: CONTACT_DATA.briefBuilder.priorities,
    fromEmail,
    toEmail
  });

  const startedAt = performance.now();

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    const durationMs = Math.round(performance.now() - startedAt);

    if (!resendRes.ok) {
      const errDetail = await resendRes.text().catch(() => '');
      console.error('Resend API error:', resendRes.status, errDetail);
      metric('contact.resend_duration_ms', durationMs, { outcome: 'error' });
      metric('contact.submissions', 1, { outcome: 'upstream_error' });
      return Response.json(
        {
          ok: false,
          code: 'UPSTREAM_ERROR',
          error: 'Email service temporarily unavailable.'
        },
        { status: 502 }
      );
    }

    metric('contact.resend_duration_ms', durationMs, { outcome: 'success' });
    metric('contact.submissions', 1, { outcome: 'success' });
    return Response.json({ ok: true, delivered: true });
  } catch (error) {
    const durationMs = Math.round(performance.now() - startedAt);
    console.error('Contact handler error:', error);
    metric('contact.resend_duration_ms', durationMs, { outcome: 'error' });
    metric('contact.submissions', 1, { outcome: 'error' });
    return Response.json(
      {
        ok: false,
        code: 'SERVER_ERROR',
        error: 'Unable to send inquiry right now.'
      },
      { status: 500 }
    );
  }
}
