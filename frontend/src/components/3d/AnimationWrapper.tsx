"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimationWrapperProps {
  children: React.ReactNode;
  isActive?: boolean;
  type?: 'fadeIn' | 'slideIn' | 'bounce' | 'scale' | 'float';
  duration?: number;
  delay?: number;
  className?: string;
}

const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
  children,
  isActive = true,
  type = 'fadeIn',
  duration = 0.5,
  delay = 0,
  className = ''
}) => {
  // Define animation variants based on type
  const getVariants = () => {
    switch (type) {
      case 'slideIn':
        return {
          hidden: { x: isActive ? -100 : 100, opacity: 0 },
          visible: { 
            x: 0, 
            opacity: 1,
            transition: { duration, delay }
          },
          exit: { 
            x: isActive ? 100 : -100, 
            opacity: 0, 
            transition: { duration: duration * 0.7 } 
          }
        };
      case 'bounce':
        return {
          hidden: { scale: 0, opacity: 0 },
          visible: { 
            scale: 1, 
            opacity: 1,
            transition: { 
              duration,
              delay 
            }
          },
          exit: { 
            scale: 0, 
            opacity: 0, 
            transition: { duration: duration * 0.5 } 
          }
        };
      case 'scale':
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: { 
            scale: 1, 
            opacity: 1,
            transition: { 
              duration,
              delay 
            }
          },
          exit: { 
            scale: 0.8, 
            opacity: 0, 
            transition: { duration: duration * 0.5 } 
          }
        };
      case 'float':
        return {
          hidden: { y: 50, opacity: 0 },
          visible: { 
            y: 0, 
            opacity: 1,
            transition: { 
              duration,
              delay 
            }
          },
          exit: { 
            y: 50, 
            opacity: 0, 
            transition: { duration: duration * 0.5 } 
          }
        };
      case 'fadeIn':
      default:
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { 
              duration,
              delay 
            }
          },
          exit: { 
            opacity: 0, 
            transition: { duration: duration * 0.5 } 
          }
        };
    }
  };

  const variants = getVariants();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        initial={type !== 'float' ? "hidden" : false}
        animate="visible"
        exit="exit"
        variants={variants}
        whileHover={type === 'float' ? { y: -5 } : undefined}
        whileTap={type === 'bounce' ? { scale: 0.95 } : undefined}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Special animated button component for calculator
interface AnimatedCalculatorButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const AnimatedCalculatorButton: React.FC<AnimatedCalculatorButtonProps> = ({
  children,
  onClick,
  isActive = false,
  className = '',
  ariaLabel
}) => {
  return (
    <motion.button
      className={`child-button ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 12px 16px rgba(0,0,0,0.2)"
      }}
      whileTap={{ 
        scale: 0.95,
        backgroundColor: isActive ? "#2ecc40" : undefined
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
    >
      {children}
    </motion.button>
  );
};

// Special animated display component
interface AnimatedDisplayProps {
  value: string;
  className?: string;
}

export const AnimatedDisplay: React.FC<AnimatedDisplayProps> = ({
  value,
  className = ''
}) => {
  return (
    <motion.div 
      className={`child-display ${className}`}
      key={value}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0, y: 20 }}
      layout
    >
      {value}
    </motion.div>
  );
};

export default AnimationWrapper;