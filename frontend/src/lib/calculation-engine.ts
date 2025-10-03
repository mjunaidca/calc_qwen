/**
 * Calculator Engine
 * Provides basic arithmetic operations and advanced mathematical functions
 */

import { saveCalculation, type StoredCalculation } from './storage';

import { handleDivisionByZero } from './error-handling';

// Basic arithmetic operations
export const add = (a: number, b: number): number => a + b;
export const subtract = (a: number, b: number): number => a - b;
export const multiply = (a: number, b: number): number => a * b;
export const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw handleDivisionByZero();
  }
  return a / b;
};

// Advanced mathematical functions
export const percentage = (value: number, percent: number): number => (value * percent) / 100;
export const squareRoot = (value: number): number => {
  if (value < 0) {
    throw new Error("Square root of negative number");
  }
  return Math.sqrt(value);
};
export const power = (base: number, exponent: number): number => Math.pow(base, exponent);
export const reciprocal = (value: number): number => {
  if (value === 0) {
    throw new Error("Reciprocal of zero");
  }
  return 1 / value;
};
export const negate = (value: number): number => -value;

// Expression evaluation
export const calculateExpression = (expression: string): { result: number; error?: string } => {
  try {
    // Sanitize the expression - only allow numbers, operators, and decimal points
    const sanitizedExpression = expression.replace(/[^0-9+\-*/.%() ]/g, '');
    
    // Replace × with * and ÷ with /
    let calcExpression = sanitizedExpression.replace(/×/g, '*').replace(/÷/g, '/');
    
    // Handle percentage operations
    calcExpression = calcExpression.replace(/(\d+(?:\.\d+)?)%/g, (_, num) => `*(${num}/100)`);
    
    // Evaluate the expression safely
    // Note: This is a simplified approach; for production, consider using a proper math expression parser
    // to prevent potential security issues with eval
    // Here we use Function constructor as a safer alternative to eval
    const result = Function('"use strict"; return (' + calcExpression + ')')();
    
    if (isNaN(result) || !isFinite(result)) {
      return { result: NaN, error: "Invalid operation (NaN or Infinity)" };
    }
    
    return { result };
  } catch (error) {
    return { result: NaN, error: (error as Error).message };
  }
};

// Safe expression calculation that doesn't use eval
export const calculate = (expression: string): number | null => {
  try {
    // Additional validation could be added here
    const result = calculateExpression(expression);
    return result.error ? null : result.result;
  } catch (error) {
    console.error("Calculation error:", error);
    return null;
  }
};

// Main calculator function that evaluates expressions
export const evaluateExpression = (expr: string): number => {
  if (!expr) return 0;
  
  // Remove all spaces
  expr = expr.replace(/\s/g, '');
  
  // Check if it ends with an operator, if so, return the number part
  if (/[+\-×÷]$/.test(expr)) {
    const numPart = expr.slice(0, -1);
    return numPart ? parseFloat(numPart) : 0;
  }
  
  // Replace × with * and ÷ with / for evaluation
  const expression = expr.replace(/×/g, '*').replace(/÷/g, '/');
  
  try {
    // Use Function as a safer way to evaluate the expression
    // This is still potentially risky with untrusted input in real apps
    // For production apps, use a proper math expression parser
    const result = Function(`"use strict"; return (${expression})`)();
    
    if (isNaN(result) || !isFinite(result)) {
      throw new Error("Invalid result");
    }
    
    return result;
  } catch (error) {
    console.error("Error evaluating expression:", expression, error);
    throw error;
  }
};

// Calculate and store the result
export const calculateAndStore = (expression: string): StoredCalculation | null => {
  try {
    const result = evaluateExpression(expression);
    if (isNaN(result) || !isFinite(result)) {
      return null;
    }
    
    // Save the calculation to storage
    const stored = saveCalculation({
      expression,
      result
    });
    
    return stored;
  } catch (error) {
    console.error("Error calculating and storing result:", error);
    return null;
  }
};

// Export the main calculation engine
export const calculationEngine = {
  add,
  subtract,
  multiply,
  divide,
  percentage,
  squareRoot,
  power,
  reciprocal,
  negate,
  calculate,
  calculateExpression,
  evaluateExpression,
  calculateAndStore
};

export default calculationEngine;