
export interface AppSettings {
  reminders: {
    preTaskMinutes: number;
    overdueMinutes: number;
    motivationalNudgeMinutes: number;
    enableReminders: boolean;
  };
  streaks: {
    weekReward: number;
    biWeekReward: number;
    monthReward: number;
    enableStreakRewards: boolean;
  };
  points: {
    missedTaskPenalty: boolean;
    qualityBonusMultiplier: number;
  };
  punishments: {
    enablePunishments: boolean;
    missedTaskPenalty: number;
    streakBreakPenalty: number;
    availablePunishments: Punishment[];
  };
  rewards: {
    enableRewards: boolean;
    availableRewards: Reward[];
  };
}

export interface Punishment {
  id: string;
  name: string;
  description: string;
  severity: 'light' | 'medium' | 'severe';
  cost: number;
  icon: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  category: 'streak' | 'achievement' | 'bonus';
  points: number;
  icon: string;
}

export const defaultSettings: AppSettings = {
  reminders: {
    preTaskMinutes: 15,
    overdueMinutes: 30,
    motivationalNudgeMinutes: 10,
    enableReminders: true,
  },
  streaks: {
    weekReward: 50,
    biWeekReward: 100,
    monthReward: 200,
    enableStreakRewards: true,
  },
  points: {
    missedTaskPenalty: true,
    qualityBonusMultiplier: 0.2,
  },
  punishments: {
    enablePunishments: false,
    missedTaskPenalty: 10,
    streakBreakPenalty: 25,
    availablePunishments: [
      { id: '1', name: 'No Social Media', description: '2 hours without social media', severity: 'light', cost: 50, icon: '📵' },
      { id: '2', name: 'Extra Exercise', description: '20 push-ups or 5 min plank', severity: 'medium', cost: 100, icon: '💪' },
      { id: '3', name: 'Cold Shower', description: '2 minute cold shower', severity: 'medium', cost: 100, icon: '🚿' },
      { id: '4', name: 'Donate Money', description: 'Donate $10 to charity', severity: 'severe', cost: 200, icon: '💰' },
      { id: '5', name: 'Wake Up Early', description: 'Wake up 1 hour earlier tomorrow', severity: 'severe', cost: 150, icon: '⏰' },
    ],
  },
  rewards: {
    enableRewards: true,
    availableRewards: [
      { id: '1', name: 'Week Streak', description: 'Complete 7 days in a row', category: 'streak', points: 100, icon: '🏆' },
      { id: '2', name: 'Perfect Day', description: 'Complete all tasks in a day', category: 'achievement', points: 50, icon: '⭐' },
      { id: '3', name: 'Month Champion', description: '30-day streak achievement', category: 'streak', points: 500, icon: '🎁' },
      { id: '4', name: 'Early Bird', description: 'Complete morning routine 5 days straight', category: 'bonus', points: 75, icon: '🌅' },
      { id: '5', name: 'Task Master', description: 'Complete 20 tasks in a week', category: 'achievement', points: 150, icon: '⚡' },
    ],
  },
};
