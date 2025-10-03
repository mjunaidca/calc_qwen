/**
 * Edge case handling utilities for the calculator
 * Manages scenarios like long calculations and rapid button presses
 */

// Maximum allowed length for display
export const MAX_DISPLAY_LENGTH = 12;

// Maximum processing time allowed (in ms) before showing warning
export const MAX_PROCESSING_TIME = 100;

// Time window (in ms) for detecting rapid button presses
export const RAPID_PRESS_WINDOW = 300;

// Maximum number of rapid presses allowed in the time window
export const MAX_RAPID_PRESSES = 5;

// Check if the display value is too long
export const isDisplayTooLong = (value: string): boolean => {
  return value.length > MAX_DISPLAY_LENGTH;
};

// Truncate display value if too long
export const truncateDisplayValue = (value: string, maxLength: number = MAX_DISPLAY_LENGTH): string => {
  if (value.length <= maxLength) return value;
  
  // If it's a number, try to show it in exponential form
  const numValue = parseFloat(value);
  if (!isNaN(numValue)) {
    // For large numbers, use exponential notation
    if (Math.abs(numValue) > 1e10) {
      return numValue.toExponential(maxLength - 5); // Reserve space for 'e+xx'
    }
  }
  
  // Otherwise, truncate and show ellipsis
  return value.substring(0, maxLength - 1) + '…';
};

// Validate rapid button presses
export class RapidPressDetector {
  private pressTimes: number[] = [];

  addPress(): boolean {
    const now = Date.now();
    this.pressTimes.push(now);

    // Remove presses older than the window
    this.pressTimes = this.pressTimes.filter(time => now - time < RAPID_PRESS_WINDOW);

    // Check if too many presses occurred in the window
    return this.pressTimes.length > MAX_RAPID_PRESSES;
  }

  reset(): void {
    this.pressTimes = [];
  }
}

// Debounce function to handle rapid inputs
export const debounce = <T extends (...args: Parameters<T>) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

// Throttle function to limit the rate of function calls
export const throttle = <T extends (...args: Parameters<T>) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
};

// Edge case handlers
const edgeCaseHandlers = {
  isDisplayTooLong,
  truncateDisplayValue,
  RapidPressDetector,
  debounce,
  throttle
};

export default edgeCaseHandlers;