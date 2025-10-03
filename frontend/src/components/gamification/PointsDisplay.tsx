"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useGamification, type UserProgress } from '@/hooks/useGamification';

interface PointsDisplayProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  progress?: UserProgress;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ 
  className = '', 
  showLabel = true, 
  size = 'md',
  progress: externalProgress
}) => {
  const [internalProgress] = useGamification();
  const progress = externalProgress || internalProgress;
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const containerSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`bg-yellow-400 ${containerSize[size]} rounded-full flex items-center justify-center mr-2`}>
        <span className="text-black font-bold text-xs sm:text-sm">★</span>
      </div>
      <motion.div
        key={progress.points}
        initial={{ scale: 1.2, color: '#fbbf24' }}
        animate={{ scale: 1, color: '#ffffff' }}
        transition={{ duration: 0.3 }}
        className={`${sizeClasses[size]} font-bold text-white flex items-center`}
      >
        {progress.points}
        {showLabel && <span className="ml-1 text-sm font-normal opacity-80">pts</span>}
      </motion.div>
    </div>
  );
};

export default PointsDisplay;