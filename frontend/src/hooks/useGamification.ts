import { useState, useEffect } from 'react';

export interface GamificationEvent {
  id: string;
  type: 'calculation_performed' | 'achievement_earned' | 'streak_milestone' | 'first_use';
  pointsEarned: number;
  timestamp: Date;
  description: string;
}

export interface UserProgress {
  points: number;
  level: number;
  achievements: string[];
  streak: number;
  lastActive: Date;
}

interface GamificationActions {
  addPoints: (points: number, description: string) => void;
  unlockAchievement: (achievement: string, description: string) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  getProgress: () => UserProgress;
  getEvents: () => GamificationEvent[];
  resetProgress: () => void;
}

const ACHIEVEMENTS = {
  FIRST_CALC: { name: "First Calculation", points: 10, description: "Complete your first calculation" },
  TEN_CALC: { name: "Calculator Enthusiast", points: 50, description: "Complete 10 calculations" },
  HUNDRED_CALC: { name: "Calculation Master", points: 200, description: "Complete 100 calculations" },
  PERFECT_STREAK: { name: "Perfect Streak", points: 100, description: "Maintain a 7-day calculation streak" },
  SPEED_DEMON: { name: "Speed Demon", points: 75, description: "Perform 5 calculations in under 30 seconds" },
};

export const useGamification = (): [UserProgress, GamificationActions] => {
  const [progress, setProgress] = useState<UserProgress>({
    points: 0,
    level: 1,
    achievements: [],
    streak: 0,
    lastActive: new Date(),
  });

  const [events, setEvents] = useState<GamificationEvent[]>([]);

  // Initialize from localStorage if available
  useEffect(() => {
    const savedProgress = localStorage.getItem('calculator-progress');
    const savedEvents = localStorage.getItem('calculator-events');
    
    if (savedProgress) {
      try {
        const parsedProgress: {
          points: number;
          level: number;
          achievements: string[];
          streak: number;
          lastActive: string; // Will be converted to Date
        } = JSON.parse(savedProgress);
        setProgress({
          ...parsedProgress,
          lastActive: new Date(parsedProgress.lastActive)
        });
      } catch (e) {
        console.error('Error loading progress from localStorage', e);
      }
    }
    
    if (savedEvents) {
      try {
        const parsedEvents: {
          id: string;
          type: 'calculation_performed' | 'achievement_earned' | 'streak_milestone' | 'first_use';
          pointsEarned: number;
          timestamp: string; // Will be converted to Date
          description: string;
        }[] = JSON.parse(savedEvents);
        setEvents(parsedEvents.map(e => ({
          ...e,
          timestamp: new Date(e.timestamp)
        })));
      } catch (e) {
        console.error('Error loading events from localStorage', e);
      }
    }
  }, []);

  // Save to localStorage whenever progress or events change
  useEffect(() => {
    const serializedProgress = JSON.stringify({
      ...progress,
      lastActive: progress.lastActive.toISOString()
    });
    localStorage.setItem('calculator-progress', serializedProgress);
  }, [progress]);

  useEffect(() => {
    const serializedEvents = JSON.stringify(events.map(event => ({
      ...event,
      timestamp: event.timestamp.toISOString()
    })));
    localStorage.setItem('calculator-events', serializedEvents);
  }, [events]);

  // Calculate level based on points
  const calculateLevel = (points: number): number => {
    // Level increases every 100 points
    return Math.floor(points / 100) + 1;
  };

  const addPoints = (points: number, description: string) => {
    setProgress(prev => {
      const newPoints = prev.points + points;
      const newLevel = calculateLevel(newPoints);
      
      const updatedProgress = {
        ...prev,
        points: newPoints,
        level: newLevel,
      };
      
      // Check for achievements
      if (points > 0) {
        // First calculation achievement
        if (prev.points === 0 && points > 0 && !prev.achievements.includes('FIRST_CALC')) {
          unlockAchievement('FIRST_CALC', ACHIEVEMENTS.FIRST_CALC.description);
        }
      }
      
      return updatedProgress;
    });

    // Add event
    const newEvent: GamificationEvent = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'calculation_performed',
      pointsEarned: points,
      timestamp: new Date(),
      description
    };
    
    setEvents(prev => [...prev, newEvent]);
  };

  const unlockAchievement = (achievementKey: string, description: string) => {
    setProgress(prev => {
      if (prev.achievements.includes(achievementKey)) {
        return prev; // Already unlocked
      }
      
      const achievement = ACHIEVEMENTS[achievementKey as keyof typeof ACHIEVEMENTS];
      if (!achievement) {
        console.error(`Unknown achievement: ${achievementKey}`);
        return prev;
      }
      
      const newEvent: GamificationEvent = {
        id: Math.random().toString(36).substring(2, 9),
        type: 'achievement_earned',
        pointsEarned: achievement.points,
        timestamp: new Date(),
        description: `${achievement.name}: ${achievement.description}`
      };
      
      setEvents(prevEvents => [...prevEvents, newEvent]);
      
      return {
        ...prev,
        points: prev.points + achievement.points,
        achievements: [...prev.achievements, achievementKey],
      };
    });
  };

  const incrementStreak = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    setProgress(prev => {
      // Check if it's the next day after last active
      const lastActiveDate = new Date(prev.lastActive);
      const isNextDay = 
        today.getDate() === lastActiveDate.getDate() + 1 && 
        today.getMonth() === lastActiveDate.getMonth() &&
        today.getFullYear() === lastActiveDate.getFullYear();
      
      // If it's the first calculation today and yesterday was active, increment streak
      // Or if it's the first time calculating, start streak at 1
      const newStreak = isNextDay || (prev.streak === 0) ? prev.streak + 1 : 1;
      
      // Check for perfect streak achievement
      if (newStreak === 7 && !prev.achievements.includes('PERFECT_STREAK')) {
        unlockAchievement('PERFECT_STREAK', ACHIEVEMENTS.PERFECT_STREAK.description);
      }
      
      return {
        ...prev,
        streak: newStreak,
        lastActive: today,
      };
    });
  };

  const resetStreak = () => {
    setProgress(prev => ({
      ...prev,
      streak: 0,
    }));
  };

  const getProgress = (): UserProgress => {
    return progress;
  };

  const getEvents = (): GamificationEvent[] => {
    return events;
  };

  const resetProgress = () => {
    setProgress({
      points: 0,
      level: 1,
      achievements: [],
      streak: 0,
      lastActive: new Date(),
    });
    setEvents([]);
    
    // Clear localStorage as well
    localStorage.removeItem('calculator-progress');
    localStorage.removeItem('calculator-events');
  };

  const actions: GamificationActions = {
    addPoints,
    unlockAchievement,
    incrementStreak,
    resetStreak,
    getProgress,
    getEvents,
    resetProgress,
  };

  return [progress, actions];
};

export default useGamification;