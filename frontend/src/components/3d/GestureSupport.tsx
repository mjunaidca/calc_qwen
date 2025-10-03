"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GestureHandlerProps {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  children: React.ReactNode;
  className?: string;
}

// Enhanced touch gesture handler for calculator operations
export const TouchGestureHandler: React.FC<GestureHandlerProps> = ({
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
  onTap,
  onDoubleTap,
  onLongPress,
  children,
  className = ''
}) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  
  // Clean up event listeners
  useEffect(() => {
    const handleTouchEnd = () => {
      if (touchStart && touchEnd) {
        // Calculate distance and direction
        const distanceX = touchEnd.x - touchStart.x;
        const distanceY = touchEnd.y - touchStart.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // Determine if it's a swipe based on distance threshold
        if (distance > 30) {
          // Determine primary direction
          if (Math.abs(distanceX) > Math.abs(distanceY)) {
            // Horizontal swipe
            if (distanceX > 0) {
              onSwipeRight?.();
            } else {
              onSwipeLeft?.();
            }
          } else {
            // Vertical swipe
            if (distanceY > 0) {
              onSwipeDown?.();
            } else {
              onSwipeUp?.();
            }
          }
        } else {
          // It's a tap
          const now = Date.now();
          if (now - lastTapTime < 300) { // Double tap threshold
            setTapCount(prev => prev + 1);
            if (tapCount === 1) {
              onDoubleTap?.();
              setTapCount(0);
            }
          } else {
            setTapCount(1);
            setTimeout(() => {
              if (tapCount === 1) {
                onTap?.();
                setTapCount(0);
              }
            }, 300);
            setLastTapTime(now);
          }
        }
      }
      
      setTouchEnd(null);
    };

    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, touchEnd, tapCount, lastTapTime, onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight, onTap, onDoubleTap]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {children}
    </div>
  );
};

// Touch-optimized calculator button with gesture support
interface TouchCalculatorButtonProps {
  value: string;
  onClick: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
  ariaLabel?: string;
  variant?: "number" | "operation" | "function" | "equals";
}

export const TouchCalculatorButton: React.FC<TouchCalculatorButtonProps> = ({
  value,
  onClick,
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
  className = '',
  ariaLabel,
  variant = "number"
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "operation":
        return "bg-[var(--button-operation-bg)] hover:bg-[var(--button-operation-hover)] text-[var(--button-operation-text)]";
      case "function":
        return "bg-[var(--button-clear-bg)] hover:bg-[var(--button-clear-hover)] text-[var(--button-clear-text)]";
      case "equals":
        return "bg-[var(--button-equals-bg)] hover:bg-[var(--button-equals-hover)] text-[var(--button-equals-text)]";
      case "number":
      default:
        return "bg-[var(--button-number-bg)] hover:bg-[var(--button-number-hover)] text-[var(--button-number-text)]";
    }
  };

  return (
    <TouchGestureHandler
      onTap={onClick}
      onSwipeUp={onSwipeUp}
      onSwipeDown={onSwipeDown}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      className={`child-button ${getButtonStyle()} ${className}`}
    >
      <motion.button
        className="w-full h-full flex items-center justify-center"
        aria-label={ariaLabel || value}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {value}
      </motion.button>
    </TouchGestureHandler>
  );
};

// Enhanced calculator display with touch feedback
interface TouchCalculatorDisplayProps {
  value: string;
  className?: string;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export const TouchCalculatorDisplay: React.FC<TouchCalculatorDisplayProps> = ({
  value,
  className = '',
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight
}) => {
  return (
    <TouchGestureHandler
      onSwipeUp={onSwipeUp}
      onSwipeDown={onSwipeDown}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      className={`child-display ${className}`}
    >
      <motion.div
        className="w-full h-full flex items-center justify-end pr-4"
        key={value}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {value}
      </motion.div>
    </TouchGestureHandler>
  );
};

// Main gesture support component
const GestureSupport: React.FC = () => {
  const [displayValue, setDisplayValue] = useState("0");
  
  // Gesture handlers for calculator operations
  const handleClearGesture = () => {
    setDisplayValue("0");
  };
  
  const handleAllClearGesture = () => {
    setDisplayValue("0");
    // Reset calculator state if needed
  };
  
  const handleNumberInput = (num: string) => {
    setDisplayValue(prev => prev === "0" ? num : prev + num);
  };
  
  return (
    <div className="w-full max-w-md">
      <TouchCalculatorDisplay 
        value={displayValue} 
        onSwipeDown={handleAllClearGesture}
        onSwipeUp={handleClearGesture}
      />
      
      <div className="grid grid-cols-4 gap-3 mt-4">
        <TouchCalculatorButton 
          value="AC" 
          onClick={() => setDisplayValue("0")} 
          variant="function"
          onSwipeLeft={handleAllClearGesture}
        />
        <TouchCalculatorButton 
          value="C" 
          onClick={() => setDisplayValue("0")} 
          variant="function"
        />
        <TouchCalculatorButton 
          value="%" 
          onClick={() => {
            const value = parseFloat(displayValue);
            setDisplayValue(String(value / 100));
          }} 
          variant="function"
        />
        <TouchCalculatorButton 
          value="÷" 
          onClick={() => setDisplayValue(displayValue + "÷")} 
          variant="operation"
        />
        
        <TouchCalculatorButton 
          value="7" 
          onClick={() => handleNumberInput("7")}
        />
        <TouchCalculatorButton 
          value="8" 
          onClick={() => handleNumberInput("8")}
        />
        <TouchCalculatorButton 
          value="9" 
          onClick={() => handleNumberInput("9")}
        />
        <TouchCalculatorButton 
          value="×" 
          onClick={() => setDisplayValue(displayValue + "×")} 
          variant="operation"
        />
        
        <TouchCalculatorButton 
          value="4" 
          onClick={() => handleNumberInput("4")}
        />
        <TouchCalculatorButton 
          value="5" 
          onClick={() => handleNumberInput("5")}
        />
        <TouchCalculatorButton 
          value="6" 
          onClick={() => handleNumberInput("6")}
        />
        <TouchCalculatorButton 
          value="-" 
          onClick={() => setDisplayValue(displayValue + "-")} 
          variant="operation"
        />
        
        <TouchCalculatorButton 
          value="1" 
          onClick={() => handleNumberInput("1")}
        />
        <TouchCalculatorButton 
          value="2" 
          onClick={() => handleNumberInput("2")}
        />
        <TouchCalculatorButton 
          value="3" 
          onClick={() => handleNumberInput("3")}
        />
        <TouchCalculatorButton 
          value="+" 
          onClick={() => setDisplayValue(displayValue + "+")} 
          variant="operation"
        />
        
        <TouchCalculatorButton 
          value="±" 
          onClick={() => {
            const value = parseFloat(displayValue);
            setDisplayValue(String(-value));
          }} 
          variant="function"
        />
        <TouchCalculatorButton 
          value="0" 
          onClick={() => handleNumberInput("0")}
        />
        <TouchCalculatorButton 
          value="." 
          onClick={() => setDisplayValue(displayValue + ".")}
        />
        <TouchCalculatorButton 
          value="=" 
          onClick={() => {
            // In a real implementation, this would evaluate the expression
            setDisplayValue(displayValue);
          }} 
          variant="equals"
        />
      </div>
    </div>
  );
};

export default GestureSupport;