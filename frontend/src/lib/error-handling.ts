/**
 * Error handling utilities for the calculator
 * Provides child-friendly error messages and validation
 */

// Define custom error types for the calculator
export class CalculatorError extends Error {
  constructor(message: string, public type: 'divisionByZero' | 'invalidOperation' | 'overflow' | 'syntaxError') {
    super(message);
    this.name = 'CalculatorError';
  }
}

// Handle division by zero with a child-friendly message
export const handleDivisionByZero = (): CalculatorError => {
  return new CalculatorError(
    "Oops! You can't divide by zero. It's like trying to share cookies with no friends!",
    'divisionByZero'
  );
};

// Handle invalid operations with a child-friendly message
export const handleInvalidOperation = (operation: string): CalculatorError => {
  return new CalculatorError(
    `Hmm, "${operation}" doesn't seem to be a valid operation. Please try again with +, -, ×, or ÷.`,
    'invalidOperation'
  );
};

// Handle number overflow with a child-friendly message
export const handleOverflow = (): CalculatorError => {
  return new CalculatorError(
    "That number is too big for me to handle! Try using smaller numbers.",
    'overflow'
  );
};

// Handle syntax errors in expressions
export const handleSyntaxError = (expression: string): CalculatorError => {
  return new CalculatorError(
    `The expression "${expression}" has a syntax error. Please check your input and try again.`,
    'syntaxError'
  );
};

// Format error message for display to children
export const formatErrorMessage = (error: CalculatorError): string => {
  switch (error.type) {
    case 'divisionByZero':
      return "No cookies to share! 🍪 Can't divide by zero!";
    case 'invalidOperation':
      return `Oops! ${error.message}`;
    case 'overflow':
      return "Number is too big! 📏 Try smaller numbers.";
    case 'syntaxError':
      return "Check your input! 🧐 Something doesn't look right.";
    default:
      return "Something went wrong! 🤔 Please try again.";
  }
};

// Validate an expression before evaluation
export const validateExpression = (expression: string): { isValid: boolean; error?: CalculatorError } => {
  if (!expression || expression.trim() === '') {
    return { 
      isValid: false, 
      error: new CalculatorError("Please enter a number or expression", 'syntaxError') 
    };
  }

  // Check for division by zero
  if (expression.includes('÷0') || expression.includes('/0')) {
    if (!expression.includes('÷0.')) { // Allow division by numbers starting with 0 like 0.5
      return { 
        isValid: false, 
        error: handleDivisionByZero() 
      };
    }
  }

  // Check for valid characters
  const validChars = /^[0-9+\-*/.%() ]+$/;
  if (!validChars.test(expression.replace(/×/g, '*').replace(/÷/g, '/'))) {
    return { 
      isValid: false, 
      error: handleSyntaxError(expression) 
    };
  }

  // Check for balanced parentheses
  let parenthesesCount = 0;
  for (const char of expression) {
    if (char === '(') parenthesesCount++;
    if (char === ')') parenthesesCount--;
    if (parenthesesCount < 0) {
      return { 
        isValid: false, 
        error: handleSyntaxError(expression) 
      };
    }
  }
  if (parenthesesCount !== 0) {
    return { 
      isValid: false, 
      error: handleSyntaxError(expression) 
    };
  }

  return { isValid: true };
};

// Error handling utility functions
const errorHandlers = {
  handleDivisionByZero,
  handleInvalidOperation,
  handleOverflow,
  handleSyntaxError,
  formatErrorMessage,
  validateExpression
};

export default errorHandlers;