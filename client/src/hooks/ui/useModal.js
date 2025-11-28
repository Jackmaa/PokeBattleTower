import { useState, useCallback } from 'react';

/**
 * Generic hook for managing modal state
 *
 * @param {boolean} initialState - Initial open/closed state (default: false)
 * @returns {Object} - { isOpen, open, close, toggle, setIsOpen }
 *
 * @example
 * const inventoryModal = useModal();
 * <FullScreenModal isOpen={inventoryModal.isOpen} onClose={inventoryModal.close}>
 */
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
}
