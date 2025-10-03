import { useState, useEffect, useCallback } from 'react';

// Define accessibility preferences
export interface AccessibilityPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  highContrast: boolean;
  reduceMotion: boolean;
  screenReaderMode: boolean;
  colorTheme: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia'; // Color blindness support
}

// Default accessibility preferences
const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  fontSize: 'medium',
  highContrast: false,
  reduceMotion: false,
  screenReaderMode: false,
  colorTheme: 'normal'
};

// Storage key
const ACCESSIBILITY_STORAGE_KEY = 'calculator-accessibility-preferences';

/**
 * Custom hook for managing accessibility preferences
 * Implements WCAG guidelines for children with various needs
 */
export const useAccessibility = () => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    // Check if we're in the browser before accessing localStorage
    if (typeof window !== 'undefined') {
      const storedPreferences = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
      if (storedPreferences) {
        try {
          return {
            ...DEFAULT_ACCESSIBILITY_PREFERENCES,
            ...JSON.parse(storedPreferences)
          };
        } catch (e) {
          console.error('Error parsing accessibility preferences', e);
        }
      }
    }
    return DEFAULT_ACCESSIBILITY_PREFERENCES;
  });

  const [isClient, setIsClient] = useState(false);

  // Mark that we're on the client side after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update document with accessibility preferences
  useEffect(() => {
    if (!isClient) return;

    // Apply font size preference
    document.documentElement.style.setProperty('--accessibility-font-size', 
      preferences.fontSize === 'small' ? '0.875rem' :
      preferences.fontSize === 'large' ? '1.25rem' :
      preferences.fontSize === 'xlarge' ? '1.5rem' : '1rem');

    // Apply high contrast preference
    if (preferences.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply reduced motion preference
    if (preferences.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [preferences, isClient]);

  // Save preferences to localStorage
  useEffect(() => {
    if (!isClient) return;
    
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences, isClient]);

  // Toggle functions for different accessibility features
  const toggleHighContrast = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      highContrast: !prev.highContrast
    }));
  }, []);

  const toggleReduceMotion = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      reduceMotion: !prev.reduceMotion
    }));
  }, []);

  const toggleScreenReaderMode = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      screenReaderMode: !prev.screenReaderMode
    }));
  }, []);

  const updateFontSize = useCallback((size: AccessibilityPreferences['fontSize']) => {
    setPreferences(prev => ({
      ...prev,
      fontSize: size
    }));
  }, []);

  const updateColorTheme = useCallback((theme: AccessibilityPreferences['colorTheme']) => {
    setPreferences(prev => ({
      ...prev,
      colorTheme: theme
    }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_ACCESSIBILITY_PREFERENCES);
  }, []);

  return {
    preferences,
    isClient,
    toggleHighContrast,
    toggleReduceMotion,
    toggleScreenReaderMode,
    updateFontSize,
    updateColorTheme,
    resetPreferences
  };
};

export default useAccessibility;