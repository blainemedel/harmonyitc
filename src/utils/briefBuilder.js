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

/**
 * Filters project items by category key ('all' returns every project).
 */
export function filterProjectsByCategory(projects, category) {
  if (!category || category === 'all') {
    return projects;
  }
  return projects.filter((project) => Array.isArray(project.categories) && project.categories.includes(category));
}
