/**
 * HarmonyITC &mdash; Dynamic Content Hydration & Interactivity
 * Reads content from content.json (or window.SITE_CONTENT offline)
 * and updates all website text dynamically.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. JSON Content Loader & Hydration Engine
  // ---------------------------------------------------------------------------
  function getNestedValue(obj, path) {
    return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
  }

  function applyContent(data) {
    if (!data) return;

    // 1. Update elements with [data-content] (inner text/html)
    document.querySelectorAll('[data-content]').forEach((el) => {
      const key = el.getAttribute('data-content');
      const val = getNestedValue(data, key);
      if (val !== undefined && val !== null) {
        // Use innerHTML to preserve inline tags like <b> or &bull; if present
        el.innerHTML = val;
      }
    });

    // 2. Update elements with [data-content-attr] (e.g. "content:meta.metaDescription")
    document.querySelectorAll('[data-content-attr]').forEach((el) => {
      const spec = el.getAttribute('data-content-attr');
      const [attr, key] = spec.split(':');
      const val = getNestedValue(data, key);
      if (attr && val !== undefined && val !== null) {
        el.setAttribute(attr, val);
      }
    });

    // 3. Update Page Title
    if (data.meta && data.meta.pageTitle) {
      document.title = data.meta.pageTitle;
    }

    // 4. Update Navigation Links
    if (data.navigation && Array.isArray(data.navigation.links)) {
      const navContainer = document.getElementById('nav-links');
      if (navContainer) {
        navContainer.innerHTML = '';
        data.navigation.links.forEach((link) => {
          const a = document.createElement('a');
          a.href = link.href || '#';
          a.className = 'nav-link';
          a.textContent = link.label || '';
          navContainer.appendChild(a);
        });
      }
    }

    // 5. Update Hero Image if specified
    if (data.hero && data.hero.image) {
      const img = document.getElementById('hero-image');
      if (img) {
        if (data.hero.image.src) img.src = data.hero.image.src;
        if (data.hero.image.alt) img.alt = data.hero.image.alt;
      }
    }

    // 6. Update Input Placeholder
    if (data.modal && data.modal.emailPlaceholder) {
      const emailInput = document.getElementById('user-email');
      if (emailInput) {
        emailInput.setAttribute('placeholder', data.modal.emailPlaceholder);
      }
    }
  }

  // Fetch content.json, with automatic fallback to window.SITE_CONTENT (for file:// protocol)
  async function initContent() {
    let content = window.SITE_CONTENT || null;

    try {
      const response = await fetch('./content.json', { cache: 'no-cache' });
      if (response.ok) {
        content = await response.json();
      }
    } catch (err) {
      // Failed fetch (likely running directly via file://) - use window.SITE_CONTENT
      console.info('Loaded content from window.SITE_CONTENT fallback.');
    }

    if (content) {
      applyContent(content);
    }
    return content;
  }

  // ---------------------------------------------------------------------------
  // 2. Modal Controls (Start a conversation / Let's talk)
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

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // ---------------------------------------------------------------------------
  // 3. Early Access Form Handling
  // ---------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const userEmailInput = document.getElementById('user-email');
  const modalSubmitBtn = document.getElementById('modal-submit-btn');
  const modalFeedback = document.getElementById('modal-feedback');
  const STORAGE_KEY = 'harmony_launch_email';

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function checkSubscribedState(content) {
    const savedEmail = localStorage.getItem(STORAGE_KEY);
    if (savedEmail && userEmailInput && modalSubmitBtn) {
      userEmailInput.value = savedEmail;
      userEmailInput.disabled = true;
      modalSubmitBtn.disabled = true;
      const btnSpan = modalSubmitBtn.querySelector('span');
      if (btnSpan) btnSpan.textContent = 'Already on the waitlist';
      if (modalFeedback) {
        const msg = (content && content.modal && content.modal.alreadySubscribedMessage) 
          || "You're registered for early platform access!";
        modalFeedback.textContent = msg;
        modalFeedback.className = 'modal-feedback success';
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 4. One-Click Clipboard Email Copy
  // ---------------------------------------------------------------------------
  const copyBtn = document.getElementById('copy-email-btn');
  const copyBadge = document.getElementById('copy-badge');
  let copyTimeoutId = null;

  function initCopyHandler(content) {
    if (copyBtn && copyBadge) {
      copyBtn.addEventListener('click', async () => {
        const emailText = (content && content.modal && content.modal.contactEmail) 
          || 'inquiries@harmonyitc.com';

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
  }

  // ---------------------------------------------------------------------------
  // Execution
  // ---------------------------------------------------------------------------
  initContent().then((loadedContent) => {
    checkSubscribedState(loadedContent);
    initCopyHandler(loadedContent);

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

        const btnSpan = modalSubmitBtn.querySelector('span');
        modalSubmitBtn.disabled = true;
        if (btnSpan) btnSpan.textContent = 'Registering...';

        setTimeout(() => {
          localStorage.setItem(STORAGE_KEY, email);
          userEmailInput.disabled = true;
          if (btnSpan) btnSpan.textContent = 'Subscribed';
          const successMsg = (loadedContent && loadedContent.modal && loadedContent.modal.successMessage)
            || 'Thank you! You will be notified the moment we go live.';
          showModalFeedback(successMsg, 'success');
        }, 650);
      });
    }
  });

  function showModalFeedback(message, type) {
    if (!modalFeedback) return;
    modalFeedback.textContent = message;
    modalFeedback.className = `modal-feedback ${type}`;
  }
})();
