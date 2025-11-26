/**
 * Configuration des keybinds pour le système de combat
 * Permet de définir des raccourcis clavier personnalisés
 */

// Keybinds par défaut pour le menu de combat principal
export const BATTLE_MENU_KEYS = {
  fight: { key: 'f', index: 0, label: 'F - FIGHT' },
  skills: { key: 's', index: 1, label: 'S - SKILLS' },
  bag: { key: 'b', index: 2, label: 'B - BAG' },
  run: { key: 'r', index: 3, label: 'R - RUN' },
};

// Keybinds universels pour la navigation
export const UNIVERSAL_KEYS = {
  confirm: ['Enter', ' '], // Enter ou Space
  cancel: ['Escape'],
  help: ['?', 'h'],
  up: ['ArrowUp', 'w'],
  down: ['ArrowDown', 's'],
  left: ['ArrowLeft', 'a'],
  right: ['ArrowRight', 'd'],
  numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
};

// Descriptions des keybinds pour l'aide contextuelle
export const KEYBIND_DESCRIPTIONS = {
  battleMenu: {
    title: 'Menu de Combat',
    keys: [
      { keys: ['F', '1'], action: 'FIGHT - Utiliser une attaque' },
      { keys: ['S', '2'], action: 'SKILLS - Utiliser une compétence' },
      { keys: ['B', '3'], action: 'BAG - Utiliser un objet' },
      { keys: ['R', '4'], action: 'RUN - Fuir le combat' },
      { keys: ['↑↓←→'], action: 'Naviguer dans le menu' },
      { keys: ['Enter'], action: 'Confirmer la sélection' },
      { keys: ['Esc'], action: 'Annuler / Retour' },
    ],
  },
  moveSelector: {
    title: 'Sélection d\'Attaque',
    keys: [
      { keys: ['1-4'], action: 'Sélectionner l\'attaque directement' },
      { keys: ['↑↓←→'], action: 'Naviguer entre les attaques' },
      { keys: ['Enter'], action: 'Utiliser l\'attaque sélectionnée' },
      { keys: ['Esc'], action: 'Retour au menu' },
    ],
  },
  targetSelector: {
    title: 'Sélection de Cible',
    keys: [
      { keys: ['↑↓'], action: 'Changer de cible' },
      { keys: ['Tab'], action: 'Changer de section (Ennemis/Alliés)' },
      { keys: ['1-9'], action: 'Sélectionner une cible directement' },
      { keys: ['Enter'], action: 'Confirmer la cible' },
      { keys: ['Esc'], action: 'Retour à la sélection d\'attaque' },
    ],
  },
  skillSelector: {
    title: 'Compétences du Dresseur',
    keys: [
      { keys: ['1-9'], action: 'Utiliser une compétence directement' },
      { keys: ['↑↓'], action: 'Naviguer entre les compétences' },
      { keys: ['Enter'], action: 'Utiliser la compétence sélectionnée' },
      { keys: ['Esc'], action: 'Retour au menu' },
    ],
  },
  universal: {
    title: 'Raccourcis Universels',
    keys: [
      { keys: ['?'], action: 'Afficher/Masquer cette aide' },
      { keys: ['Esc'], action: 'Annuler / Retour au menu précédent' },
      { keys: ['Enter', 'Space'], action: 'Confirmer' },
    ],
  },
};

// Classe pour gérer la configuration des keybinds
export class KeybindManager {
  constructor() {
    this.config = this.loadConfig();
  }

  // Charger la configuration depuis localStorage
  loadConfig() {
    try {
      const saved = localStorage.getItem('pokebattle_keybinds');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des keybinds:', error);
    }

    // Configuration par défaut
    return {
      enabled: true,
      battleMenu: BATTLE_MENU_KEYS,
      universal: UNIVERSAL_KEYS,
    };
  }

  // Sauvegarder la configuration
  saveConfig() {
    try {
      localStorage.setItem('pokebattle_keybinds', JSON.stringify(this.config));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des keybinds:', error);
    }
  }

  // Activer/désactiver les keybinds
  setEnabled(enabled) {
    this.config.enabled = enabled;
    this.saveConfig();
  }

  isEnabled() {
    return this.config.enabled;
  }

  // Obtenir les touches personnalisées pour le menu de combat
  getBattleMenuKeys() {
    return this.config.battleMenu || BATTLE_MENU_KEYS;
  }

  // Créer un objet de mappage {key: index} pour useKeyboardNavigation
  getBattleMenuCustomKeys() {
    const keys = this.getBattleMenuKeys();
    const customKeys = {};

    Object.values(keys).forEach(({ key, index }) => {
      customKeys[key] = index;
    });

    return customKeys;
  }

  // Réinitialiser aux valeurs par défaut
  reset() {
    this.config = {
      enabled: true,
      battleMenu: BATTLE_MENU_KEYS,
      universal: UNIVERSAL_KEYS,
    };
    this.saveConfig();
  }
}

// Instance singleton
export const keybindManager = new KeybindManager();

// Helper pour obtenir les descriptions de touches pour un contexte
export const getKeybindHelp = (context) => {
  return KEYBIND_DESCRIPTIONS[context] || KEYBIND_DESCRIPTIONS.universal;
};

// Helper pour formater les touches pour l'affichage
export const formatKey = (key) => {
  const keyMap = {
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    'Enter': '⏎',
    'Escape': 'Esc',
    ' ': 'Space',
  };

  return keyMap[key] || key.toUpperCase();
};

// Helper pour obtenir le numéro associé à un élément dans une grille 2x2
export const getGridNumber = (index) => {
  return (index + 1).toString();
};

export default keybindManager;
