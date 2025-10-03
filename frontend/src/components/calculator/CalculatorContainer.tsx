"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { FeedbackCalculatorDisplay, FeedbackCalculatorButton } from "@/components/3d/VisualFeedback";
import { useCalculator } from "@/hooks/useCalculator";
import { useGamification } from "@/hooks/useGamification";
import PointsDisplay from "@/components/gamification/PointsDisplay";
import { calculationEngine } from "@/lib/calculation-engine";
import { getRecentCalculations } from "@/lib/storage";
import { formatErrorMessage, CalculatorError } from "@/lib/error-handling";
import Calculator3DIntegration from "@/components/3d/Calculator3DIntegration";
import { debounce, throttle } from "@/lib/edge-case-handling";

export default function CalculatorContainer() {
  const [state, actions] = useCalculator();
  const [gamificationProgress, gamificationActions] = useGamification();
  const [hasError, setHasError] = useState(false);
  const [recentCalculations, setRecentCalculations] = useState(() => getRecentCalculations());
  
  // Memoize expensive computations
  const displayValue = useMemo(() => state.displayValue, [state.displayValue]);
  
  // Throttle the calculation result function to prevent rapid calculations
  const throttledCalculateResult = useMemo(
    () => throttle(() => {
      // Get the current expression before calculating
      const expression = state.displayValue;
      
      try {
        actions.calculateResult();
        
        // Add more points for completing a calculation
        gamificationActions.addPoints(10, "Completed calculation");
        gamificationActions.incrementStreak();
        
        // Calculate and store the result
        if (expression && !isNaN(parseFloat(expression)) && expression.match(/[+\-×÷]/)) {
          const result = calculationEngine.calculateAndStore(expression);
          if (result) {
            setRecentCalculations(getRecentCalculations());
          }
        }
      } catch (error) {
        // Handle calculator errors (like division by zero)
        if (error instanceof CalculatorError) {
          // Show child-friendly error message in the display
          actions.clearDisplay();
          // In a real app, we might want to show this differently
          // For now, we'll just log the formatted error
          console.log(formatErrorMessage(error));
        } else {
          // Handle other errors
          console.error("Unexpected error during calculation:", error);
          actions.clearDisplay();
        }
      }
    }, 100), // Limit to once every 100ms
    [actions, gamificationActions, state.displayValue]
  );
  
  // Debounce the digit input to prevent rapid inputs
  const debouncedInputDigit = useMemo(
    () => debounce((digit: string) => {
      actions.inputDigit(digit);
      // Add a small point for each digit entered
      gamificationActions.addPoints(1, `Entered digit ${digit}`);
    }, 50),
    [actions, gamificationActions]
  );
  
  // Handle calculation events for gamification
  const handleOperation = useCallback((operation: string) => {
    actions.performOperation(operation);
    // Add points for performing an operation
    gamificationActions.addPoints(5, `Performed ${operation} operation`);
    gamificationActions.incrementStreak();
  }, [actions, gamificationActions]);
  
  const handleCalculateResult = useCallback(() => {
    throttledCalculateResult();
  }, [throttledCalculateResult]);
  
  const handleDigitInput = useCallback((digit: string) => {
    debouncedInputDigit(digit);
  }, [debouncedInputDigit]);

  // Handle special cases for display
  useEffect(() => {
    if (displayValue === "NaN") {
      setHasError(true);
      const timer = setTimeout(() => {
        actions.clearAll();
        setHasError(false);
      }, 1500); // Automatically clear after showing error
      return () => clearTimeout(timer);
    }
  }, [displayValue, actions]);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-[var(--calculator-bg)] p-4 w-full"
      role="main"
      aria-label="Interactive Calculator for Children"
    >
      <div className="w-full max-w-md landscape:max-w-lg landscape:w-11/12 portrait:w-11/12">
        {/* Points display header */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold text-white">Calculator</h1>
          <PointsDisplay size="lg" progress={gamificationProgress} />
        </div>
        
        <FeedbackCalculatorDisplay 
          value={displayValue} 
          role="status"
          aria-live="polite"
          aria-label={`Calculator display showing ${displayValue}`}
        />
        
        <div 
          className="grid grid-cols-4 gap-2 sm:gap-3 mt-4 p-2 rounded-xl bg-[var(--button-number-bg)]"
          role="group"
          aria-label="Calculator buttons"
        >
          {/* First row */}
          <FeedbackCalculatorButton 
            value="AC" 
            onClick={() => {
              actions.clearAll();
              gamificationActions.addPoints(2, "Cleared calculator");
            }}
            variant="function"
            ariaLabel="All Clear"
            role="button"
          />
          <FeedbackCalculatorButton 
            value="C" 
            onClick={() => {
              actions.clearDisplay();
              gamificationActions.addPoints(1, "Cleared display");
            }}
            variant="function"
            ariaLabel="Clear"
            role="button"
          />
          <FeedbackCalculatorButton 
            value="%" 
            onClick={() => {
              actions.inputPercent();
              gamificationActions.addPoints(3, "Used percentage function");
            }}
            variant="function"
            ariaLabel="Percentage"
            role="button"
          />
          <FeedbackCalculatorButton 
            value="÷" 
            onClick={() => handleOperation("÷")} 
            variant="operation"
            ariaLabel="Divide"
            role="button"
          />
          
          {/* Second row */}
          <FeedbackCalculatorButton 
            value="7" 
            onClick={() => handleDigitInput("7")} 
            ariaLabel="Seven"
            role="button"
          />
          <FeedbackCalculatorButton 
            value="8" 
            onClick={() => handleDigitInput("8")} 
            ariaLabel="Eight"
            role="button"
          />
          <FeedbackCalculatorButton 
            value="9" 
            onClick={() => handleDigitInput("9")} 
            ariaLabel="Nine"
            role="button"
          />
          <FeedbackCalculatorButton 
            value="×" 
            onClick={() => handleOperation("×")} 
            variant="operation"
            ariaLabel="Multiply"
            role="button"
          />
          
          {/* Third row */}
          <FeedbackCalculatorButton 
            value="4" 
            onClick={() => handleDigitInput("4")} 
            ariaLabel="Four"
            role="button"
          />
          <FeedbackCalculatorButton 
            value="5" 
            onClick={() => handleDigitInput("5")} 
            ariaLabel="Five"
            role="button"
          />
          <FeedbackCalculatorButton 
            value="6" 
            onClick={() => handleDigitInput("6")} 
            ariaLabel="Six"
            role="button"
          />
          <FeedbackCalculatorButton 
            value="-" 
            onClick={() => handleOperation("-")} 
            variant="operation"
            ariaLabel="Subtract"
            role="button"
          />
          
          {/* Fourth row */}
          <FeedbackCalculatorButton 
            value="1" 
            onClick={() => handleDigitInput("1")} 
            ariaLabel="One"
            role="button"
          />
          <FeedbackCalculatorButton 
            value="2" 
            onClick={() => handleDigitInput("2")} 
            ariaLabel="Two"
            role="button"
          />
          <FeedbackCalculatorButton 
            value="3" 
            onClick={() => handleDigitInput("3")} 
            ariaLabel="Three"
            role="button"
          />
          <FeedbackCalculatorButton 
            value="+" 
            onClick={() => handleOperation("+")} 
            variant="operation"
            ariaLabel="Add"
            role="button"
          />
          
          {/* Fifth row */}
          <FeedbackCalculatorButton 
            value="±" 
            onClick={() => {
              actions.toggleSign();
              gamificationActions.addPoints(2, "Toggled sign");
            }}
            variant="function"
            ariaLabel="Toggle Sign"
            role="button"
          />
          <FeedbackCalculatorButton 
            value="0" 
            onClick={() => handleDigitInput("0")} 
            ariaLabel="Zero"
            role="button"
          />
          <FeedbackCalculatorButton 
            value="." 
            onClick={() => {
              actions.inputDot();
              gamificationActions.addPoints(1, "Added decimal point");
            }}
            ariaLabel="Decimal Point"
            role="button"
          />
          <FeedbackCalculatorButton 
            value="=" 
            onClick={handleCalculateResult} 
            variant="equals"
            ariaLabel="Equals"
            role="button"
          />
        </div>
        
        {/* 3D Calculator Integration - hidden on small screens if needed */}
        <div className="mt-4 hidden md:block">
          <Calculator3DIntegration isActive={true} />
        </div>
      </div>
    </div>
  );
}