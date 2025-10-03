"use client";

import React, { useState, useEffect } from 'react';
import CalculatorScene from '@/components/3d/CalculatorScene';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalculator } from '@/hooks/useCalculator';

interface Calculator3DIntegrationProps {
  isActive: boolean;
}

const Calculator3DIntegration: React.FC<Calculator3DIntegrationProps> = ({ isActive }) => {
  const [state] = useCalculator();
  const [showScene, setShowScene] = useState(isActive);
  
  // Update 3D scene visibility when active state changes
  useEffect(() => {
    setShowScene(isActive);
  }, [isActive]);
  
  // Animate the 3D scene based on calculator state
  const getSceneAnimation = () => {
    // The scene could react to different operations
    switch (true) {
      case state.displayValue.includes('0'):
        return { scale: 1.02 }; // Slight scale for zero
      case state.displayValue.includes('.'):
        return { rotateX: Math.sin(Date.now() / 1000) * 0.1 }; // Gentle rotation for decimal
      case state.pendingOperation !== null:
        return { z: -10 }; // Move forward when operation pending
      default:
        return { scale: 1 };
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence>
        {showScene && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <CalculatorScene isActive={isActive} />
            <p className="text-center text-sm text-gray-600 mt-2">
              3D Calculator View - Current value: {state.displayValue}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calculator3DIntegration;