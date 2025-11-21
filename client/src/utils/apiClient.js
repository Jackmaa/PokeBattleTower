// API Client for PokeBattleTower Backend
// Handles all communication with the server

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ============================================
// Tower Save API
// ============================================

export const towerAPI = {
  /**
   * Get all saves for a user
   */
  async getSaves(userId) {
    return fetchAPI(`/tower/saves/${userId}`);
  },

  /**
   * Get a specific save slot
   */
  async getSave(userId, slotId) {
    return fetchAPI(`/tower/saves/${userId}/${slotId}`);
  },

  /**
   * Save game to a slot
   */
  async save(userId, slotId, saveData) {
    return fetchAPI('/tower/saves', {
      method: 'POST',
      body: JSON.stringify({ userId, slotId, ...saveData })
    });
  },

  /**
   * Delete a save slot
   */
  async deleteSave(userId, slotId) {
    return fetchAPI(`/tower/saves/${userId}/${slotId}`, {
      method: 'DELETE'
    });
  },

  /**
   * Get autosave
   */
  async getAutosave(userId) {
    return fetchAPI(`/tower/autosave/${userId}`);
  },

  /**
   * Create/update autosave
   */
  async autosave(userId, saveData) {
    return fetchAPI('/tower/autosave', {
      method: 'POST',
      body: JSON.stringify({ userId, ...saveData })
    });
  }
};

// ============================================
// Leaderboard API
// ============================================

export const leaderboardAPI = {
  /**
   * Get global leaderboard
   */
  async getLeaderboard(options = {}) {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);
    if (options.filter) params.append('filter', options.filter);
    if (options.difficulty) params.append('difficulty', options.difficulty);

    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchAPI(`/leaderboard${query}`);
  },

  /**
   * Get user's leaderboard entries
   */
  async getUserEntries(userId, limit = 10) {
    return fetchAPI(`/leaderboard/user/${userId}?limit=${limit}`);
  },

  /**
   * Submit a run to leaderboard
   */
  async submitRun(runData) {
    return fetchAPI('/leaderboard', {
      method: 'POST',
      body: JSON.stringify(runData)
    });
  },

  /**
   * Get global stats
   */
  async getStats() {
    return fetchAPI('/leaderboard/stats');
  }
};

// ============================================
// User API
// ============================================

export const userAPI = {
  /**
   * Get user profile
   */
  async getProfile(userId) {
    return fetchAPI(`/users/${userId}`);
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, updates) {
    return fetchAPI(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  /**
   * Update after completing a run
   */
  async completeRun(userId, runData) {
    return fetchAPI(`/users/${userId}/run-complete`, {
      method: 'POST',
      body: JSON.stringify(runData)
    });
  },

  /**
   * Spend permanent gold
   */
  async spendGold(userId, amount) {
    return fetchAPI(`/users/${userId}/spend-gold`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  },

  /**
   * Get achievements
   */
  async getAchievements(userId) {
    return fetchAPI(`/users/${userId}/achievements`);
  },

  /**
   * Get available starters
   */
  async getStarters(userId) {
    return fetchAPI(`/users/${userId}/starters`);
  }
};

// ============================================
// Legacy Runs API (for backwards compatibility)
// ============================================

export const runsAPI = {
  /**
   * Get all runs
   */
  async getRuns() {
    return fetchAPI('/runs');
  },

  /**
   * Save a run
   */
  async saveRun(runData) {
    return fetchAPI('/runs', {
      method: 'POST',
      body: JSON.stringify(runData)
    });
  }
};

// ============================================
// Health Check
// ============================================

export async function checkAPIHealth() {
  try {
    const result = await fetchAPI('/health');
    return { online: true, ...result };
  } catch (error) {
    return { online: false, error: error.message };
  }
}

// ============================================
// User ID Management (anonymous users)
// ============================================

const USER_ID_KEY = 'pbt_user_id';

/**
 * Get or create anonymous user ID
 */
export function getUserId() {
  let userId = localStorage.getItem(USER_ID_KEY);

  if (!userId) {
    // Generate a unique ID
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }

  return userId;
}

/**
 * Set username for user
 */
export function setUsername(username) {
  localStorage.setItem('pbt_username', username);
}

/**
 * Get username
 */
export function getUsername() {
  return localStorage.getItem('pbt_username') || 'Trainer';
}

// Export all APIs
export default {
  tower: towerAPI,
  leaderboard: leaderboardAPI,
  user: userAPI,
  runs: runsAPI,
  checkHealth: checkAPIHealth,
  getUserId,
  getUsername,
  setUsername
};
