/**
 * Storage utilities for browser storage
 * Manages recent calculations and user preferences
 */

// Define the structure for stored calculations
export interface StoredCalculation {
  id: string;
  expression: string;
  result: number;
  timestamp: Date;
}

export interface CalculatorStorageData {
  recentCalculations: StoredCalculation[];
  userPreferences: {
    theme: 'light' | 'dark';
    historyLimit: number;
    showAnimations: boolean;
  };
  lastActive: Date;
}

// Storage keys
const STORAGE_KEYS = {
  CALCULATIONS: 'calculator-calculations',
  PREFERENCES: 'calculator-preferences',
  LAST_ACTIVE: 'calculator-last-active'
};

// Default values
const DEFAULT_HISTORY_LIMIT = 10;
const DEFAULT_PREFERENCES = {
  theme: 'light' as const,
  historyLimit: DEFAULT_HISTORY_LIMIT,
  showAnimations: true,
};

/**
 * Gets recent calculations from browser storage
 */
export const getRecentCalculations = (limit: number = DEFAULT_HISTORY_LIMIT): StoredCalculation[] => {
  try {
    // Check if we're in a browser environment
    if (typeof localStorage === 'undefined') {
      return [];
    }
    
    const storedData = localStorage.getItem(STORAGE_KEYS.CALCULATIONS);
    if (!storedData) {
      return [];
    }
    
    const parsedData: {
      id: string;
      expression: string;
      result: number;
      timestamp: string; // Will be converted to Date object
    }[] = JSON.parse(storedData);
    
    // Convert ISO strings back to Date objects
    return parsedData
      .map(item => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }))
      .sort((a: StoredCalculation, b: StoredCalculation) => b.timestamp.getTime() - a.timestamp.getTime()) // Sort by most recent
      .slice(0, limit);
  } catch (error) {
    console.error('Error reading recent calculations from storage:', error);
    return [];
  }
};

/**
 * Saves a calculation to browser storage
 */
export const saveCalculation = (calculation: Omit<StoredCalculation, 'id' | 'timestamp'>): StoredCalculation => {
  try {
    // Check if we're in a browser environment
    if (typeof localStorage === 'undefined') {
      return {
        ...calculation,
        id: Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
        timestamp: new Date()
      };
    }
    
    const newCalculation: StoredCalculation = {
      ...calculation,
      id: Math.random().toString(36).substring(2, 15) + Date.now().toString(36), // Generate unique ID
      timestamp: new Date()
    };
    
    const existingCalculations = getRecentCalculations();
    const updatedCalculations = [newCalculation, ...existingCalculations]; // Add new at beginning
    
    // Keep only the most recent calculations based on history limit
    const historyLimit = getUserPreferences().historyLimit;
    const finalCalculations = updatedCalculations.slice(0, historyLimit);
    
    localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(finalCalculations));
    
    return newCalculation;
  } catch (error) {
    console.error('Error saving calculation to storage:', error);
    throw error;
  }
};

/**
 * Clears the calculation history from storage
 */
export const clearHistory = (): void => {
  try {
    // Check if we're in a browser environment
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CALCULATIONS);
    }
  } catch (error) {
    console.error('Error clearing history from storage:', error);
    throw error;
  }
};

/**
 * Gets user preferences from browser storage
 */
export const getUserPreferences = (): CalculatorStorageData['userPreferences'] => {
  try {
    // Check if we're in a browser environment
    if (typeof localStorage === 'undefined') {
      return DEFAULT_PREFERENCES;
    }
    
    const storedPreferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!storedPreferences) {
      return DEFAULT_PREFERENCES;
    }
    
    const parsedPreferences = JSON.parse(storedPreferences);
    return {
      ...DEFAULT_PREFERENCES,
      ...parsedPreferences
    };
  } catch (error) {
    console.error('Error reading user preferences from storage:', error);
    return DEFAULT_PREFERENCES;
  }
};

/**
 * Updates user preferences in browser storage
 */
export const updateUserPreferences = (preferences: Partial<CalculatorStorageData['userPreferences']>): CalculatorStorageData['userPreferences'] => {
  try {
    // Check if we're in a browser environment
    if (typeof localStorage === 'undefined') {
      return {
        ...DEFAULT_PREFERENCES,
        ...preferences
      };
    }
    
    const currentPreferences = getUserPreferences();
    const updatedPreferences = {
      ...currentPreferences,
      ...preferences
    };
    
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updatedPreferences));
    return updatedPreferences;
  } catch (error) {
    console.error('Error updating user preferences in storage:', error);
    throw error;
  }
};

/**
 * Gets the last active timestamp from storage
 */
export const getLastActive = (): Date | null => {
  try {
    // Check if we're in a browser environment
    if (typeof localStorage === 'undefined') {
      return null;
    }
    
    const storedLastActive = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE);
    if (!storedLastActive) {
      return null;
    }
    
    return new Date(storedLastActive);
  } catch (error) {
    console.error('Error reading last active timestamp from storage:', error);
    return null;
  }
};

/**
 * Updates the last active timestamp in storage
 */
export const updateLastActive = (): void => {
  try {
    // Check if we're in a browser environment
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, new Date().toISOString());
    }
  } catch (error) {
    console.error('Error updating last active timestamp in storage:', error);
    throw error;
  }
};

/**
 * Clears all calculator data from browser storage
 */
export const clearAllData = (): void => {
  try {
    // Check if we're in a browser environment
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CALCULATIONS);
      localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
      localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVE);
    }
  } catch (error) {
    console.error('Error clearing all calculator data from storage:', error);
    throw error;
  }
};

/**
 * Gets all stored calculator data
 */
export const getAllStoredData = (): CalculatorStorageData => {
  return {
    recentCalculations: getRecentCalculations(),
    userPreferences: getUserPreferences(),
    lastActive: getLastActive() || new Date()
  };
};

// Export the storage utility functions as a module
const storageUtils = {
  getRecentCalculations,
  saveCalculation,
  clearHistory,
  getUserPreferences,
  updateUserPreferences,
  getLastActive,
  updateLastActive,
  clearAllData,
  getAllStoredData
};

export default storageUtils;