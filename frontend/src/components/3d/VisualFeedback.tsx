"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VisualFeedbackProps {
  isActive: boolean;
  type?: 'press' | 'ripple' | 'glow' | 'pulse' | 'bounce';
  position?: { x: number; y: number };
  children: React.ReactNode;
}

// Visual feedback effect component
export const VisualFeedback: React.FC<VisualFeedbackProps> = ({
  isActive,
  type = 'press',
  position = { x: 0, y: 0 },
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  if (type === 'ripple' && isActive) {
    return (
      <div className="relative" ref={containerRef}>
        {children}
        <motion.div
          className="absolute rounded-full bg-blue-500/30"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ 
            width: 200, 
            height: 200, 
            opacity: 0 
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onAnimationComplete={() => {}}
        />
      </div>
    );
  }
  
  // Default press effect
  return (
    <motion.div
      animate={isActive ? { 
        scale: 0.95,
        boxShadow: "0 8px 16px rgba(0,0,0,0.2)"
      } : {
        scale: 1,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
      }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 20 
      }}
    >
      {children}
    </motion.div>
  );
};

// Enhanced calculator button with visual feedback
interface FeedbackCalculatorButtonProps {
  value: string;
  onClick: () => void;
  className?: string;
  variant?: "number" | "operation" | "function" | "equals";
  ariaLabel?: string;
  role?: string;
}

export const FeedbackCalculatorButton: React.FC<FeedbackCalculatorButtonProps> = ({
  value,
  onClick,
  className = '',
  variant = "number",
  ariaLabel,
  role
}) => {
  const [isActive, setIsActive] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const handleClick = (e: React.MouseEvent) => {
    // Add ripple effect at click position
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = { id: rippleId.current++, x, y };
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }
    
    setIsActive(true);
    onClick();
    
    // Reset active state after animation
    setTimeout(() => setIsActive(false), 150);
  };

  const getButtonStyle = () => {
    switch (variant) {
      case "operation":
        return "bg-[var(--button-operation-bg)] text-[var(--button-operation-text)]";
      case "function":
        return "bg-[var(--button-clear-bg)] text-[var(--button-clear-text)]";
      case "equals":
        return "bg-[var(--button-equals-bg)] text-[var(--button-equals-text)]";
      case "number":
      default:
        return "bg-[var(--button-number-bg)] text-[var(--button-number-text)]";
    }
  };

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        className={`child-button ${getButtonStyle()} ${className}`}
        onClick={handleClick}
        aria-label={ariaLabel || value}
        role={role}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 6px 12px rgba(0,0,0,0.15)"
        }}
        whileTap={{ 
          scale: 0.95,
          backgroundColor: variant === 'number' 
            ? 'var(--button-number-hover)' 
            : variant === 'operation'
              ? 'var(--button-operation-hover)'
              : variant === 'function'
                ? 'var(--button-clear-hover)'
                : 'var(--button-equals-hover)'
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 17 
        }}
      >
        {value}
      </motion.button>
      
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
              width: 0,
              height: 0
            }}
            initial={{ width: 0, height: 0, opacity: 0.7 }}
            animate={{ 
              width: 200, 
              height: 200, 
              opacity: 0 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Enhanced display with visual feedback
interface FeedbackCalculatorDisplayProps {
  value: string;
  className?: string;
  role?: string;
  'aria-live'?: 'off' | 'assertive' | 'polite';
  'aria-label'?: string;
}

export const FeedbackCalculatorDisplay: React.FC<FeedbackCalculatorDisplayProps> = ({
  value,
  className = '',
  role,
  'aria-live': ariaLive,
  'aria-label': ariaLabel
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [prevValue, setPrevValue] = useState(value);

  // Trigger animation when value changes
  useEffect(() => {
    if (value !== prevValue) {
      setPrevValue(value);
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 300);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <motion.div 
      className={`child-display ${className}`}
      role={role}
      aria-live={ariaLive}
      aria-label={ariaLabel}
      animate={showAnimation ? { 
        backgroundColor: "var(--calculator-display)",
        scale: [1, 1.02, 1]
      } : {}}
      transition={{ 
        duration: 0.3,
        times: [0, 0.5, 1] 
      }}
    >
      {value}
    </motion.div>
  );
};

// Visual feedback animation wrapper for calculator components
interface CalculatorFeedbackWrapperProps {
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
}

export const CalculatorFeedbackWrapper: React.FC<CalculatorFeedbackWrapperProps> = ({
  children,
  onValueChange
}) => {
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'none'>('none');
  
  // Function to trigger different feedback types
  const triggerFeedback = (type: 'success' | 'error' | 'none') => {
    setFeedbackType(type);
    setTimeout(() => setFeedbackType('none'), 1000);
  };

  return (
    <motion.div
      animate={{
        backgroundColor: feedbackType === 'success' 
          ? 'rgba(46, 204, 64, 0.2)' 
          : feedbackType === 'error' 
            ? 'rgba(231, 76, 60, 0.2)' 
            : 'transparent'
      }}
      transition={{ duration: 0.3 }}
      className="p-1 rounded-lg"
    >
      {children}
    </motion.div>
  );
};

export default FeedbackCalculatorButton;