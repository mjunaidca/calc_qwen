import { useState, useCallback } from 'react';
import { add, subtract, multiply, divide } from '@/lib/calculation-engine';

interface CalculatorState {
  displayValue: string;
  firstOperand: number | null;
  pendingOperation: string | null;
  waitingForOperand: boolean;
}

interface CalculatorActions {
  clearAll: () => void;
  clearDisplay: () => void;
  inputDigit: (digit: string) => void;
  inputDot: () => void;
  toggleSign: () => void;
  inputPercent: () => void;
  performOperation: (operation: string) => void;
  calculateResult: () => void;
}

// Calculate function
const calculate = (first: number, second: number, operation: string): number => {
  switch (operation) {
    case '+':
      return add(first, second);
    case '-':
      return subtract(first, second);
    case '×':
      return multiply(first, second);
    case '÷':
      return divide(first, second);
    default:
      return second;
  }
};

export const useCalculator = (): [CalculatorState, CalculatorActions] => {
  const [state, setState] = useState<CalculatorState>({
    displayValue: '0',
    firstOperand: null,
    pendingOperation: null,
    waitingForOperand: false,
  });

  const clearAll = useCallback(() => {
    setState({
      displayValue: '0',
      firstOperand: null,
      pendingOperation: null,
      waitingForOperand: false,
    });
  }, []);

  const clearDisplay = useCallback(() => {
    setState(prev => ({
      ...prev,
      displayValue: '0',
    }));
  }, []);

  const inputDigit = useCallback((digit: string) => {
    setState(prev => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          displayValue: digit,
          waitingForOperand: false,
        };
      }
      
      return {
        ...prev,
        displayValue: prev.displayValue === '0' ? digit : prev.displayValue + digit,
      };
    });
  }, []);

  const inputDot = useCallback(() => {
    setState(prev => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          displayValue: '0.',
          waitingForOperand: false,
        };
      }

      if (!prev.displayValue.includes('.')) {
        return {
          ...prev,
          displayValue: prev.displayValue + '.',
        };
      }
      
      return prev;
    });
  }, []);

  const toggleSign = useCallback(() => {
    setState(prev => {
      const value = parseFloat(prev.displayValue);
      if (value > 0) {
        return {
          ...prev,
          displayValue: '-' + prev.displayValue,
        };
      } else if (value < 0) {
        return {
          ...prev,
          displayValue: prev.displayValue.slice(1),
        };
      }
      return prev;
    });
  }, []);

  const inputPercent = useCallback(() => {
    setState(prev => {
      const value = parseFloat(prev.displayValue);
      return {
        ...prev,
        displayValue: String(value / 100),
      };
    });
  }, []);

  const performOperation = useCallback((nextOperation: string) => {
    setState(prev => {
      const inputValue = parseFloat(prev.displayValue);

      let firstOperand = prev.firstOperand;
      if (firstOperand === null) {
        firstOperand = inputValue;
      } else if (prev.pendingOperation) {
        try {
          const result = calculate(firstOperand, inputValue, prev.pendingOperation);
          return {
            displayValue: String(result),
            firstOperand: result,
            pendingOperation: nextOperation,
            waitingForOperand: true,
          };
        } catch (error) {
          // Handle calculator errors (like division by zero)
          if (error instanceof Error && error.message.includes("zero")) {
            return {
              displayValue: "Error: Can't divide by 0!",
              firstOperand: null,
              pendingOperation: null,
              waitingForOperand: true,
            };
          } else {
            return {
              displayValue: "Error",
              firstOperand: null,
              pendingOperation: null,
              waitingForOperand: true,
            };
          }
        }
      }

      return {
        ...prev,
        firstOperand,
        pendingOperation: nextOperation,
        waitingForOperand: true,
      };
    });
  }, []);

  const calculateResult = useCallback(() => {
    setState(prev => {
      if (prev.firstOperand === null || prev.pendingOperation === null) {
        return prev;
      }

      const inputValue = parseFloat(prev.displayValue);
      try {
        const result = calculate(prev.firstOperand, inputValue, prev.pendingOperation);
        
        return {
          displayValue: String(result),
          firstOperand: null,
          pendingOperation: null,
          waitingForOperand: true,
        };
      } catch (error) {
        // Handle calculator errors (like division by zero)
        if (error instanceof Error && error.message.includes("zero")) {
          return {
            displayValue: "Error: Can't divide by 0!",
            firstOperand: null,
            pendingOperation: null,
            waitingForOperand: true,
          };
        } else {
          return {
            displayValue: "Error",
            firstOperand: null,
            pendingOperation: null,
            waitingForOperand: true,
          };
        }
      }
    });
  }, []);

  const actions: CalculatorActions = {
    clearAll,
    clearDisplay,
    inputDigit,
    inputDot,
    toggleSign,
    inputPercent,
    performOperation,
    calculateResult,
  };

  return [state, actions];
};