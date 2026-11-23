// Gene - Nov, 23, 2026: Owner-tracked body scroll lock so drawer and modal never clobber each other
const activeLockOwners = new Set();

/**
 * Locks or unlocks document body scrolling for a named UI owner (e.g., 'mobile-drawer', 'case-modal').
 */
export function setBodyScrollLock(owner, locked) {
  if (locked) {
    activeLockOwners.add(owner);
  } else {
    activeLockOwners.delete(owner);
  }
  document.body.style.overflow = activeLockOwners.size > 0 ? 'hidden' : '';
}
