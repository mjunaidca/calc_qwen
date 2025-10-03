"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '@/hooks/useGamification';

interface RewardSystemProps {
  isActive?: boolean;
}

const RewardSystem: React.FC<RewardSystemProps> = ({ isActive = true }) => {
  const [progress, gamificationActions] = useGamification();
  const [showReward, setShowReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');

  // Show a reward notification when points are earned
  useEffect(() => {
    if (isActive) {
      const events = gamificationActions.getEvents();
      if (events.length > 0) {
        const lastEvent = events[events.length - 1];
        if (lastEvent.pointsEarned > 0) {
          setRewardMessage(`+${lastEvent.pointsEarned} points! ${lastEvent.description}`);
          setShowReward(true);
          const timer = setTimeout(() => setShowReward(false), 3000);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [progress.points, isActive, gamificationActions]);

  // Level up animation
  useEffect(() => {
    if (isActive) {
      const events = gamificationActions.getEvents();
      if (events.length > 0) {
        const lastEvent = events[events.length - 1];
        if (lastEvent.type === 'achievement_earned') {
          setRewardMessage(`Achievement Unlocked! ${lastEvent.description}`);
          setShowReward(true);
          const timer = setTimeout(() => setShowReward(false), 4000);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [progress.achievements, isActive, gamificationActions]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress Summary */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-yellow-400 w-10 h-10 rounded-full flex items-center justify-center mr-3">
            <span className="text-black font-bold">{progress.level}</span>
          </div>
          <div>
            <p className="text-white text-sm">Level</p>
            <p className="text-white font-bold">{progress.level}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="bg-blue-400 w-10 h-10 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold">★</span>
          </div>
          <div>
            <p className="text-white text-sm">Points</p>
            <p className="text-white font-bold">{progress.points}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="bg-orange-400 w-10 h-10 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold">🔥</span>
          </div>
          <div>
            <p className="text-white text-sm">Streak</p>
            <p className="text-white font-bold">{progress.streak} days</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
        <h3 className="text-white font-bold mb-2">Achievements</h3>
        <div className="flex flex-wrap gap-2">
          {progress.achievements.length > 0 ? (
            progress.achievements.map((achievement, index) => (
              <div 
                key={index} 
                className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg px-3 py-1 text-xs text-yellow-100"
              >
                ✓ {achievement.replace('_', ' ')}
              </div>
            ))
          ) : (
            <p className="text-gray-300 text-sm">No achievements yet. Start calculating to unlock!</p>
          )}
        </div>
      </div>

      {/* Reward Notification */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-full shadow-lg z-50"
          >
            {rewardMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Reward Actions */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button 
          onClick={() => gamificationActions.addPoints(10, "Bonus points")}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          +10 Points
        </button>
        <button 
          onClick={() => gamificationActions.unlockAchievement('FIRST_CALC', 'First Calculation')}
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Unlock Achievement
        </button>
      </div>
    </div>
  );
};

export default RewardSystem;