// Gene - Nov, 24, 2026: Pure validation, escaping, Resend email builder, and route query parsing for Contact Hub

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Escapes HTML special characters so user input is safe inside HTML emails.
 */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validates and normalizes an inquiry submission payload.
 * Returns { ok, isSpam, errors, data }.
 */
export function validateInquiryPayload(raw, validPriorityIds = []) {
  const input = raw && typeof raw === 'object' ? raw : {};

  // Honeypot trap: bots fill hidden fields; respond silently without sending mail
  if (String(input.website || '').trim().length > 0) {
    return { ok: true, isSpam: true, errors: {}, data: null };
  }

  const name = String(input.name || '').trim();
  const email = String(input.email || '').trim();
  const company = String(input.company || '').trim();
  const message = String(input.message || '').trim();
  const validSet = new Set(validPriorityIds);
  const priorities = Array.isArray(input.priorities)
    ? Array.from(new Set(input.priorities.filter((id) => validSet.has(id))))
    : [];

  const errors = {};

  if (name.length < 2 || name.length > 100) {
    errors.name = 'Please enter your name (2–100 characters).';
  }
  if (!email || email.length > 200 || !EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid work or personal email address.';
  }
  if (company.length > 120) {
    errors.company = 'Company name must be 120 characters or fewer.';
  }
  if (message.length < 10 || message.length > 3000) {
    errors.message = 'Please share a brief overview of your project (10–3000 characters).';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, isSpam: false, errors, data: null };
  }

  return {
    ok: true,
    isSpam: false,
    errors: {},
    data: { name, email, company, message, priorities }
  };
}

/**
 * Builds the Resend REST API payload with safe HTML escaping.
 */
export function buildResendEmailPayload({ data, priorityList, fromEmail, toEmail }) {
  const labelById = Object.fromEntries(priorityList.map((p) => [p.id, p.briefLabel]));
  const selectedLabels = data.priorities.map((id) => labelById[id]).filter(Boolean);
  const focusSummary = selectedLabels.length > 0 ? selectedLabels.join(', ') : 'General Consultation';

  const subjectTarget = data.company || data.name;
  const subject = `HarmonyITC Inquiry from ${subjectTarget}`;

  const text = [
    'New Harmony IT Consultancy Inquiry',
    '==================================',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company: ${data.company || 'Not specified'}`,
    `Focus Areas: ${focusSummary}`,
    '',
    'Project Notes:',
    data.message
  ].join('\n');

  const focusListHtml =
    selectedLabels.length > 0
      ? `<ul>${selectedLabels.map((label) => `<li>${escapeHtml(label)}</li>`).join('')}</ul>`
      : '<p>General Consultation</p>';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0c2d4f; line-height: 1.55;">
      <h2 style="margin: 0 0 12px;">New Inquiry &mdash; Harmony IT Consultancy</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Company:</strong> ${escapeHtml(data.company || 'Not specified')}</p>
      <p><strong>Focus Areas:</strong></p>
      ${focusListHtml}
      <p><strong>Project Details:</strong></p>
      <pre style="white-space: pre-wrap; font-family: inherit; background: #f4f7fb; padding: 12px; border-radius: 8px;">${escapeHtml(data.message)}</pre>
    </div>
  `.trim();

  return {
    from: fromEmail,
    to: [toEmail],
    reply_to: data.email,
    subject,
    text,
    html
  };
}

/**
 * Parses ?focus= and ?project= query params from Case Study CTAs into initial Contact form state.
 */
export function parseContactQuery(query, validPriorityIds = [], projects = []) {
  const q = query && typeof query === 'object' ? query : {};
  const validSet = new Set(validPriorityIds);

  const rawFocus = typeof q.focus === 'string' ? q.focus.trim() : '';
  // Gene - Nov, 24, 2026: Default scope selection to empty unless explicitly passed via ?focus=
  /*
  const initialPriorities = rawFocus && validSet.has(rawFocus) ? [rawFocus] : [...validPriorityIds];
  */
  const initialPriorities = rawFocus && validSet.has(rawFocus) ? [rawFocus] : [];

  const rawProjectId = typeof q.project === 'string' ? q.project.trim() : '';
  const matchedProject = rawProjectId ? projects.find((p) => p.id === rawProjectId) : null;
  const starterMessage = matchedProject
    ? `Hi Paulo, Gene, and Bry — we're interested in building a custom system similar to ${matchedProject.title}.`
    : '';

  return {
    priorities: initialPriorities,
    starterMessage,
    referencedProjectTitle: matchedProject ? matchedProject.title : ''
  };
}
