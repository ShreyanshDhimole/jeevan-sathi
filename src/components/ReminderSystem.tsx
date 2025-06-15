
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RoutineItem } from '@/types/routine';
import { Bell, Zap, AlertTriangle } from 'lucide-react';

interface ReminderSystemProps {
  routineItems: RoutineItem[];
  onUpdateTask: (taskId: string, updates: Partial<RoutineItem>) => void;
}

export const ReminderSystem = ({ routineItems, onUpdateTask }: ReminderSystemProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      routineItems.forEach(task => {
        if (task.status === 'upcoming' && !task.reminderSent) {
          const [time, period] = task.time.split(' ');
          const [hour, minute] = time.split(':').map(Number);
          const taskHour = period === 'PM' && hour !== 12 ? hour + 12 : (period === 'AM' && hour === 12 ? 0 : hour);
          const taskTime = taskHour * 60 + minute;

          // Send reminder 15 minutes before
          if (currentTime >= taskTime - 15 && currentTime < taskTime) {
            toast({
              title: "Upcoming Task! ⏰",
              description: `"${task.task}" starts in 15 minutes. Get ready!`,
              duration: 8000,
            });
            onUpdateTask(task.id, { reminderSent: true });
          }

          // Send start reminder
          if (currentTime >= taskTime && currentTime < taskTime + 5) {
            toast({
              title: "Time to Start! 🚀",
              description: `It's time for "${task.task}". Let's go!`,
              duration: 10000,
            });
          }

          // Send nudge for overdue tasks
          if (currentTime > taskTime + 10 && task.status === 'upcoming') {
            toast({
              title: "Don't Give Up! 💪",
              description: `"${task.task}" is overdue. You can still do it!`,
              duration: 12000,
            });
          }
        }

        // Motivational nudges for in-progress tasks
        if (task.status === 'in-progress' && task.startedAt) {
          const startTime = new Date(task.startedAt);
          const elapsed = (now.getTime() - startTime.getTime()) / (1000 * 60); // minutes
          
          if (elapsed === 10) {
            toast({
              title: "Keep Going! 🔥",
              description: `You've been at "${task.task}" for 10 minutes. Stay focused!`,
              duration: 6000,
            });
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [routineItems, toast, onUpdateTask]);

  return null; // This component doesn't render anything
};
