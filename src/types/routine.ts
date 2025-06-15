export interface RoutineItem {
  id: string;
  time: string;
  task: string;
  status: 'completed' | 'current' | 'upcoming' | 'missed' | 'in-progress';
  priority: 'high' | 'medium' | 'low';
  flexible: boolean;
  points: number;
  streak: number;
  lastCompleted?: string;
  quality?: number; // 1-5 stars
  completionHistory: CompletionRecord[];
  reminderSent?: boolean;
  startedAt?: string;
  duration: number; // estimated time in minutes
  compressible: boolean; // can be shortened if needed
  dependsOn?: string; // optional task ID that must come before
  minDuration?: number; // minimum time if compressed (only if compressible)
}

export interface CompletionRecord {
  date: string;
  quality: number;
  duration?: number;
  notes?: string;
  pointsEarned: number;
}

export interface StreakReward {
  streakDays: number;
  bonusPoints: number;
  title: string;
  description: string;
}
