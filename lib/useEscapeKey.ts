import { useEffect } from 'react';

/**
 * Close-on-Escape for overlays.
 *
 * `components/ui/Modal.tsx` had its own inline keydown listener, but the three
 * hand-rolled overlays (CartDrawer, OrderReceiptModal, the guest-review modal in
 * GoogleReviewsSection) each built their own markup and registered none, so Esc
 * silently did nothing on them. This hook gives every overlay the same
 * behaviour without pulling in a dependency.
 *
 * The listener is only attached while the overlay is open, so closed overlays
 * cost nothing and multiple stacked overlays do not fight over the key.
 */
export function useEscapeKey(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
}