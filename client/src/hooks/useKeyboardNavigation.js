import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook pour gérer la navigation clavier dans les interfaces de sélection
 * Supporte les grilles et les listes avec navigation par flèches, touches numériques et confirmation
 *
 * @param {Object} options - Configuration du hook
 * @param {Array} options.items - Liste des éléments sélectionnables
 * @param {boolean} options.enabled - Active/désactive la navigation clavier
 * @param {string} options.layout - Type de layout ('grid' ou 'list')
 * @param {number} options.columns - Nombre de colonnes pour layout 'grid'
 * @param {function} options.onSelect - Callback appelé lors de la sélection (Enter/Space)
 * @param {function} options.onCancel - Callback appelé lors de l'annulation (Escape)
 * @param {function} options.onChange - Callback appelé à chaque changement de sélection
 * @param {number} options.initialIndex - Index initial de sélection
 * @param {boolean} options.loop - Permet de boucler du dernier au premier élément
 * @param {boolean} options.enableNumberKeys - Active les touches 1-9 pour sélection directe
 * @param {Object} options.customKeys - Touches personnalisées {key: index} (ex: {f: 0, s: 1})
 * @param {function} options.isItemDisabled - Fonction pour déterminer si un item est désactivé
 * @returns {Object} État et méthodes de navigation
 */
export const useKeyboardNavigation = ({
  items = [],
  enabled = true,
  layout = 'list',
  columns = 1,
  onSelect,
  onCancel,
  onChange,
  initialIndex = 0,
  loop = true,
  enableNumberKeys = true,
  customKeys = {},
  isItemDisabled = () => false,
} = {}) => {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [focusSource, setFocusSource] = useState('keyboard'); // 'keyboard' ou 'mouse'
  const itemsRef = useRef(items);

  // Mettre à jour la ref quand items change
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // S'assurer que l'index reste dans les limites
  useEffect(() => {
    if (items.length > 0 && selectedIndex >= items.length) {
      setSelectedIndex(Math.max(0, items.length - 1));
    }
  }, [items.length, selectedIndex]);

  // Trouver le prochain index valide (non désactivé)
  const findNextValidIndex = useCallback((startIndex, direction = 1) => {
    const total = itemsRef.current.length;
    if (total === 0) return -1;

    let nextIndex = startIndex;
    let attempts = 0;

    while (attempts < total) {
      nextIndex = ((nextIndex + direction) % total + total) % total;

      if (!isItemDisabled(itemsRef.current[nextIndex], nextIndex)) {
        return nextIndex;
      }

      attempts++;
    }

    return startIndex; // Retour à l'index de départ si tous sont désactivés
  }, [isItemDisabled]);

  // Navigation par flèches (grid-aware)
  const navigate = useCallback((direction) => {
    if (!enabled || items.length === 0) return;

    let nextIndex = selectedIndex;

    if (layout === 'grid') {
      const rows = Math.ceil(items.length / columns);
      const currentRow = Math.floor(selectedIndex / columns);
      const currentCol = selectedIndex % columns;

      switch (direction) {
        case 'up':
          if (currentRow > 0) {
            nextIndex = selectedIndex - columns;
          } else if (loop) {
            // Aller à la dernière rangée, même colonne
            nextIndex = Math.min(
              (rows - 1) * columns + currentCol,
              items.length - 1
            );
          }
          break;

        case 'down':
          if (currentRow < rows - 1 && selectedIndex + columns < items.length) {
            nextIndex = selectedIndex + columns;
          } else if (loop) {
            // Aller à la première rangée, même colonne
            nextIndex = currentCol;
          }
          break;

        case 'left':
          if (currentCol > 0) {
            nextIndex = selectedIndex - 1;
          } else if (loop) {
            // Aller à la fin de la rangée actuelle
            nextIndex = Math.min(
              currentRow * columns + (columns - 1),
              items.length - 1
            );
          }
          break;

        case 'right':
          if (currentCol < columns - 1 && selectedIndex + 1 < items.length) {
            nextIndex = selectedIndex + 1;
          } else if (loop) {
            // Aller au début de la rangée actuelle
            nextIndex = currentRow * columns;
          }
          break;

        default:
          break;
      }
    } else {
      // Liste simple
      switch (direction) {
        case 'up':
        case 'left':
          nextIndex = loop
            ? (selectedIndex - 1 + items.length) % items.length
            : Math.max(0, selectedIndex - 1);
          break;

        case 'down':
        case 'right':
          nextIndex = loop
            ? (selectedIndex + 1) % items.length
            : Math.min(items.length - 1, selectedIndex + 1);
          break;

        case 'home':
          nextIndex = 0;
          break;

        case 'end':
          nextIndex = items.length - 1;
          break;

        default:
          break;
      }
    }

    // Vérifier si le prochain index est valide, sinon chercher le suivant
    if (isItemDisabled(items[nextIndex], nextIndex)) {
      const validIndex = findNextValidIndex(nextIndex, direction === 'up' || direction === 'left' ? -1 : 1);
      nextIndex = validIndex;
    }

    if (nextIndex !== selectedIndex) {
      setSelectedIndex(nextIndex);
      setFocusSource('keyboard');
      onChange?.(items[nextIndex], nextIndex);
    }
  }, [enabled, items, selectedIndex, layout, columns, loop, onChange, isItemDisabled, findNextValidIndex]);

  // Confirmation
  const confirm = useCallback(() => {
    if (!enabled || items.length === 0) return;

    const item = items[selectedIndex];
    if (!isItemDisabled(item, selectedIndex)) {
      onSelect?.(item, selectedIndex);
    }
  }, [enabled, items, selectedIndex, onSelect, isItemDisabled]);

  // Annulation
  const cancel = useCallback(() => {
    if (!enabled) return;
    onCancel?.();
  }, [enabled, onCancel]);

  // Sélection directe par index
  const selectByIndex = useCallback((index) => {
    if (!enabled || index < 0 || index >= items.length) return;

    if (!isItemDisabled(items[index], index)) {
      setSelectedIndex(index);
      setFocusSource('keyboard');
      onChange?.(items[index], index);
    }
  }, [enabled, items, onChange, isItemDisabled]);

  // Gestionnaire d'événements clavier
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    const key = event.key.toLowerCase();
    let handled = false;

    // Navigation par flèches
    if (key === 'arrowup') {
      navigate('up');
      handled = true;
    } else if (key === 'arrowdown') {
      navigate('down');
      handled = true;
    } else if (key === 'arrowleft') {
      navigate('left');
      handled = true;
    } else if (key === 'arrowright') {
      navigate('right');
      handled = true;
    }
    // Home/End
    else if (key === 'home') {
      navigate('home');
      handled = true;
    } else if (key === 'end') {
      navigate('end');
      handled = true;
    }
    // Confirmation
    else if (key === 'enter' || key === ' ') {
      confirm();
      handled = true;
    }
    // Annulation
    else if (key === 'escape') {
      cancel();
      handled = true;
    }
    // Touches numériques du pavé principal (sans MAJ) et du numpad
    else if (enableNumberKeys) {
      // Vérifier event.code pour distinguer les vraies touches numériques
      const digitMatch = event.code.match(/^(?:Digit|Numpad)([0-9])$/);
      if (digitMatch) {
        const digit = digitMatch[1];
        if (digit >= '1' && digit <= '9') {
          const index = parseInt(digit) - 1;
          if (index < items.length) {
            selectByIndex(index);
            // Auto-confirm avec les touches numériques
            if (!isItemDisabled(items[index], index)) {
              onSelect?.(items[index], index);
            }
            handled = true;
          }
        }
      }
    }
    // Touches personnalisées
    else if (customKeys[key] !== undefined) {
      const index = customKeys[key];
      if (index < items.length) {
        selectByIndex(index);
        // Auto-confirm avec les touches personnalisées
        if (!isItemDisabled(items[index], index)) {
          onSelect?.(items[index], index);
        }
        handled = true;
      }
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, [enabled, navigate, confirm, cancel, selectByIndex, enableNumberKeys, customKeys, items, onSelect, isItemDisabled]);

  // Attacher/détacher le listener global
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  // Réinitialiser à l'index initial quand items change
  useEffect(() => {
    if (items.length > 0) {
      const validInitialIndex = Math.min(initialIndex, items.length - 1);
      if (!isItemDisabled(items[validInitialIndex], validInitialIndex)) {
        setSelectedIndex(validInitialIndex);
      } else {
        // Trouver le premier index valide
        const firstValid = findNextValidIndex(-1, 1);
        setSelectedIndex(firstValid >= 0 ? firstValid : 0);
      }
    }
  }, [items, initialIndex, isItemDisabled, findNextValidIndex]);

  // Helper pour obtenir les props à appliquer sur les items
  const getItemProps = useCallback((index) => ({
    'data-keyboard-index': index,
    'data-keyboard-selected': index === selectedIndex && focusSource === 'keyboard',
    onClick: () => {
      // Seulement changer la source au clic, pas au hover
      setSelectedIndex(index);
      setFocusSource('mouse');
    },
  }), [selectedIndex, focusSource]);

  return {
    selectedIndex,
    setSelectedIndex,
    selectedItem: items[selectedIndex],
    handleKeyDown,
    navigate,
    confirm,
    cancel,
    selectByIndex,
    getItemProps,
    isKeyboardFocused: focusSource === 'keyboard',
    enabled,
  };
};

export default useKeyboardNavigation;
