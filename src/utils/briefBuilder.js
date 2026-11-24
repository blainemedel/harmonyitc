// Gene - Nov, 23, 2026: Pure helper utilities for Contact brief formatting and Projects category filtering

/**
 * Formats a concise human-readable summary of selected priority IDs.
 */
export function formatPrioritySummary(selectedIds, priorityList) {
  const labelById = Object.fromEntries(priorityList.map((p) => [p.id, p.briefLabel]));
  const validSelected = selectedIds.filter((id) => labelById[id]);

  if (validSelected.length === 0) {
    return 'None selected yet (choose at least 1 area)';
  }
  if (validSelected.length === priorityList.length && priorityList.length > 0) {
    return `All ${priorityList.length} Areas Selected (Full Website & System Setup)`;
  }
  return validSelected.map((id) => labelById[id]).join(', ');
}

/**
 * Builds the clipboard-ready project brief block.
 */
export function buildClipboardBrief(selectedIds, priorityList, email) {
  const labelById = Object.fromEntries(priorityList.map((p) => [p.id, p.briefLabel]));
  const validSelected = selectedIds.filter((id) => labelById[id]);

  const priorityLines =
    validSelected.length > 0
      ? validSelected.map((id, idx) => `  ${idx + 1}. ${labelById[id]}`).join('\n')
      : '  - General Consultation';

  return `[Harmony IT Consultancy — Project Brief]
Target Email: ${email}

Our Core Business Priorities:
${priorityLines}`;
}

/**
 * Builds a properly encoded mailto URL containing the selected project priorities.
 */
export function buildMailtoHref(selectedIds, priorityList, email) {
  const labelById = Object.fromEntries(priorityList.map((p) => [p.id, p.briefLabel]));
  const validSelected = selectedIds.filter((id) => labelById[id]);

  const subject = encodeURIComponent('Project Consultation Brief — Harmony IT Consultancy');
  const priorityLines =
    validSelected.length > 0
      ? validSelected.map((id, idx) => `  ${idx + 1}. ${labelById[id]}`).join('\n')
      : '  - General Inquiry';

  const body = encodeURIComponent(
    `Hi Paulo, Gene, and Bry,\n\nI'd like to talk about a website or system project for our business. Here is what matters most to us right now:\n\n${priorityLines}\n\nCompany Name:\nContact Person:\nBest Time for a Call:\n\nThanks!`
  );

  return `mailto:${email}?subject=${subject}&body=${body}`;
}

// Gene - Nov, 24, 2026: Added platform-first project filtering and full inquiry fallback mailto generator

/**
 * Filters project items by platform key ('web', 'admin', 'mobile') or legacy category ('all' returns every project).
 */
export function filterProjectsByCategory(projects, category) {
  if (!category || category === 'all') {
    return projects;
  }
  /*
  return projects.filter((project) => Array.isArray(project.categories) && project.categories.includes(category));
  */
  return projects.filter(
    (project) =>
      project.platform === category ||
      (Array.isArray(project.categories) && project.categories.includes(category))
  );
}

/**
 * Builds a prefilled fallback mailto link preserving entered form values when server email delivery is unavailable.
 */
export function buildInquiryFallbackMailto({ name, email, company, message, priorities }, priorityList, targetEmail) {
  const labelById = Object.fromEntries(priorityList.map((p) => [p.id, p.briefLabel]));
  const validSelected = Array.isArray(priorities) ? priorities.filter((id) => labelById[id]) : [];

  const priorityLines =
    validSelected.length > 0
      ? validSelected.map((id, idx) => `  ${idx + 1}. ${labelById[id]}`).join('\n')
      : '  - General Inquiry';

  const cleanName = String(name || '').trim() || 'Not provided';
  const cleanEmail = String(email || '').trim() || 'Not provided';
  const cleanCompany = String(company || '').trim() || 'Not provided';
  const cleanMessage = String(message || '').trim() || 'Not provided';

  const subject = encodeURIComponent(`Project Inquiry — ${cleanCompany !== 'Not provided' ? cleanCompany : cleanName}`);
  const body = encodeURIComponent(
    `Hi Paulo, Gene, and Bry,\n\nName: ${cleanName}\nReply Email: ${cleanEmail}\nCompany: ${cleanCompany}\n\nFocus Areas:\n${priorityLines}\n\nProject Details:\n${cleanMessage}\n`
  );

  return `mailto:${targetEmail}?subject=${subject}&body=${body}`;
}
