// 📁 themeManager.js
// Theme management system with CSS variables

export const THEMES = {
  dark: {
    id: 'dark',
    name: 'Dark Gaming',
    icon: '🌙',
    colors: {
      // Primary backgrounds
      '--bg-primary': '#0f0a1e',
      '--bg-secondary': '#1a1130',
      '--bg-tertiary': '#241845',

      // Gradient colors
      '--gradient-from': '#1e1b4b',
      '--gradient-via': '#312e81',
      '--gradient-to': '#0f0a1e',

      // Accent colors
      '--accent-primary': '#818cf8',
      '--accent-secondary': '#a78bfa',
      '--accent-tertiary': '#c4b5fd',

      // Text colors
      '--text-primary': '#ffffff',
      '--text-secondary': 'rgba(255, 255, 255, 0.8)',
      '--text-muted': 'rgba(255, 255, 255, 0.6)',

      // Border colors
      '--border-primary': 'rgba(129, 140, 248, 0.3)',
      '--border-secondary': 'rgba(255, 255, 255, 0.1)',

      // Orb colors for background
      '--orb-1': 'rgba(168, 85, 247, 0.3)',
      '--orb-2': 'rgba(59, 130, 246, 0.3)',
      '--orb-3': 'rgba(99, 102, 241, 0.2)',
    }
  },

  light: {
    id: 'light',
    name: 'Light Mode',
    icon: '☀️',
    colors: {
      '--bg-primary': '#f8fafc',
      '--bg-secondary': '#e2e8f0',
      '--bg-tertiary': '#cbd5e1',

      '--gradient-from': '#dbeafe',
      '--gradient-via': '#e0e7ff',
      '--gradient-to': '#f8fafc',

      '--accent-primary': '#4f46e5',
      '--accent-secondary': '#6366f1',
      '--accent-tertiary': '#818cf8',

      '--text-primary': '#1e293b',
      '--text-secondary': '#475569',
      '--text-muted': '#64748b',

      '--border-primary': 'rgba(79, 70, 229, 0.3)',
      '--border-secondary': 'rgba(0, 0, 0, 0.1)',

      '--orb-1': 'rgba(168, 85, 247, 0.15)',
      '--orb-2': 'rgba(59, 130, 246, 0.15)',
      '--orb-3': 'rgba(99, 102, 241, 0.1)',
    }
  },

  retro: {
    id: 'retro',
    name: 'Retro',
    icon: '🎮',
    colors: {
      '--bg-primary': '#0f380f',
      '--bg-secondary': '#306230',
      '--bg-tertiary': '#8bac0f',

      '--gradient-from': '#0f380f',
      '--gradient-via': '#306230',
      '--gradient-to': '#0f380f',

      '--accent-primary': '#9bbc0f',
      '--accent-secondary': '#8bac0f',
      '--accent-tertiary': '#cbdc3f',

      '--text-primary': '#9bbc0f',
      '--text-secondary': '#8bac0f',
      '--text-muted': '#306230',

      '--border-primary': 'rgba(155, 188, 15, 0.5)',
      '--border-secondary': 'rgba(155, 188, 15, 0.3)',

      '--orb-1': 'rgba(155, 188, 15, 0.2)',
      '--orb-2': 'rgba(139, 172, 15, 0.2)',
      '--orb-3': 'rgba(203, 220, 63, 0.1)',
    }
  },

  fire: {
    id: 'fire',
    name: 'Fire',
    icon: '🔥',
    colors: {
      '--bg-primary': '#1a0a0a',
      '--bg-secondary': '#2d1515',
      '--bg-tertiary': '#4a1f1f',

      '--gradient-from': '#7c2d12',
      '--gradient-via': '#9a3412',
      '--gradient-to': '#1a0a0a',

      '--accent-primary': '#f97316',
      '--accent-secondary': '#fb923c',
      '--accent-tertiary': '#fdba74',

      '--text-primary': '#ffffff',
      '--text-secondary': 'rgba(255, 255, 255, 0.8)',
      '--text-muted': 'rgba(255, 255, 255, 0.6)',

      '--border-primary': 'rgba(249, 115, 22, 0.4)',
      '--border-secondary': 'rgba(255, 255, 255, 0.1)',

      '--orb-1': 'rgba(249, 115, 22, 0.3)',
      '--orb-2': 'rgba(220, 38, 38, 0.3)',
      '--orb-3': 'rgba(251, 146, 60, 0.2)',
    }
  },

  ocean: {
    id: 'ocean',
    name: 'Ocean',
    icon: '🌊',
    colors: {
      '--bg-primary': '#0a1628',
      '--bg-secondary': '#0f2540',
      '--bg-tertiary': '#164e63',

      '--gradient-from': '#0e7490',
      '--gradient-via': '#0891b2',
      '--gradient-to': '#0a1628',

      '--accent-primary': '#22d3ee',
      '--accent-secondary': '#67e8f9',
      '--accent-tertiary': '#a5f3fc',

      '--text-primary': '#ffffff',
      '--text-secondary': 'rgba(255, 255, 255, 0.8)',
      '--text-muted': 'rgba(255, 255, 255, 0.6)',

      '--border-primary': 'rgba(34, 211, 238, 0.4)',
      '--border-secondary': 'rgba(255, 255, 255, 0.1)',

      '--orb-1': 'rgba(34, 211, 238, 0.3)',
      '--orb-2': 'rgba(6, 182, 212, 0.3)',
      '--orb-3': 'rgba(103, 232, 249, 0.2)',
    }
  }
};

/**
 * Apply theme to document root
 */
export function applyTheme(themeId) {
  const theme = THEMES[themeId];
  if (!theme) {
    console.warn(`Theme ${themeId} not found, using dark`);
    applyTheme('dark');
    return;
  }

  const root = document.documentElement;

  // Apply all CSS variables
  Object.entries(theme.colors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Set theme class on body
  document.body.className = document.body.className
    .replace(/theme-\w+/g, '')
    .trim();
  document.body.classList.add(`theme-${themeId}`);

  // Store in localStorage for persistence
  localStorage.setItem('pbt_theme', themeId);

  console.log(`Theme applied: ${theme.name}`);
}

/**
 * Get current theme from localStorage
 */
export function getCurrentTheme() {
  return localStorage.getItem('pbt_theme') || 'dark';
}

/**
 * Initialize theme on app load
 */
export function initializeTheme() {
  const savedTheme = getCurrentTheme();
  applyTheme(savedTheme);
}

/**
 * Get all available themes
 */
export function getAvailableThemes() {
  return Object.values(THEMES);
}
