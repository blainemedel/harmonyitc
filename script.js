/**
 * HarmonyITC &mdash; Work in Progress Landing Page
 * Vanilla JavaScript (ES6+) - 100% native, zero dependencies
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Modal Controls (Start a conversation / Let's talk)
  // ---------------------------------------------------------------------------
  const modalBackdrop = document.getElementById('contact-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const headerContactBtn = document.getElementById('header-contact-btn');
  const primaryCtaBtn = document.getElementById('primary-cta-btn');
  const exploreLinkBtn = document.getElementById('explore-link-btn');

  function openModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const input = document.getElementById('user-email');
    if (input) {
      setTimeout(() => input.focus(), 150);
    }
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (headerContactBtn) headerContactBtn.addEventListener('click', openModal);
  if (primaryCtaBtn) primaryCtaBtn.addEventListener('click', openModal);
  if (exploreLinkBtn) exploreLinkBtn.addEventListener('click', openModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  // Close modal on Escape key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // ---------------------------------------------------------------------------
  // 2. Early Access Notify Form Handling
  // ---------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const userEmailInput = document.getElementById('user-email');
  const modalSubmitBtn = document.getElementById('modal-submit-btn');
  const modalFeedback = document.getElementById('modal-feedback');
  const STORAGE_KEY = 'harmony_launch_email';

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  // Pre-fill if already submitted
  const savedEmail = localStorage.getItem(STORAGE_KEY);
  if (savedEmail && userEmailInput && modalSubmitBtn) {
    userEmailInput.value = savedEmail;
    userEmailInput.disabled = true;
    modalSubmitBtn.disabled = true;
    const btnSpan = modalSubmitBtn.querySelector('span');
    if (btnSpan) btnSpan.textContent = 'Already on the waitlist';
    if (modalFeedback) {
      modalFeedback.textContent = "You're registered for early platform access!";
      modalFeedback.className = 'modal-feedback success';
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = userEmailInput.value.trim();

      if (!email) {
        showModalFeedback('Please enter your email address.', 'error');
        userEmailInput.focus();
        return;
      }

      if (!isValidEmail(email)) {
        showModalFeedback('Please enter a valid corporate email address.', 'error');
        userEmailInput.focus();
        return;
      }

      // Button loading state
      const btnSpan = modalSubmitBtn.querySelector('span');
      const originalText = btnSpan ? btnSpan.textContent : 'Notify me upon launch';
      modalSubmitBtn.disabled = true;
      if (btnSpan) btnSpan.textContent = 'Registering...';

      setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, email);
        userEmailInput.disabled = true;
        if (btnSpan) btnSpan.textContent = 'Subscribed';
        showModalFeedback('Thank you! You will be notified the moment we go live.', 'success');
      }, 700);
    });
  }

  function showModalFeedback(message, type) {
    if (!modalFeedback) return;
    modalFeedback.textContent = message;
    modalFeedback.className = `modal-feedback ${type}`;
  }

  // ---------------------------------------------------------------------------
  // 3. One-Click Clipboard Email Copy
  // ---------------------------------------------------------------------------
  const copyBtn = document.getElementById('copy-email-btn');
  const copyBadge = document.getElementById('copy-badge');
  let copyTimeoutId = null;

  if (copyBtn && copyBadge) {
    copyBtn.addEventListener('click', async () => {
      const emailText = 'inquiries@harmonyitc.com';

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailText);
        } else {
          const tempInput = document.createElement('textarea');
          tempInput.value = emailText;
          tempInput.style.position = 'fixed';
          tempInput.style.opacity = '0';
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        copyBadge.classList.add('show');
        if (copyTimeoutId) clearTimeout(copyTimeoutId);
        copyTimeoutId = setTimeout(() => {
          copyBadge.classList.remove('show');
        }, 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    });
  }
})();
