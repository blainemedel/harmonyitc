// Gene - Nov, 23, 2026: Shared clipboard helper and reactive toast notification state
import { ref } from 'vue';

const toastVisible = ref(false);
const toastMessage = ref('Copied to clipboard!');
let hideToastTimer = null;

/**
 * Displays the shared bottom-right toast message for 3 seconds.
 */
export function showToast(message) {
  if (message) {
    toastMessage.value = message;
  }
  toastVisible.value = true;
  clearTimeout(hideToastTimer);
  hideToastTimer = setTimeout(() => {
    toastVisible.value = false;
  }, 3000);
}

/**
 * Copies plain text using the Clipboard API with a textarea fallback.
 */
export async function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      // Fallback below for non-HTTPS or restricted contexts
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch (_) {
    copied = false;
  }
  document.body.removeChild(textarea);
  return copied;
}

export function useClipboard() {
  return {
    toastVisible,
    toastMessage,
    showToast,
    copyTextToClipboard
  };
}
