
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RoutineItem } from '@/types/routine';
import { AppSettings, defaultSettings } from '@/types/settings';

interface ReminderSystemProps {
  routineItems: RoutineItem[];
  onUpdateTask: (taskId: string, updates: Partial<RoutineItem>) => void;
}

export const ReminderSystem = ({ routineItems, onUpdateTask }: ReminderSystemProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!settings.reminders.enableReminders) return;

    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      routineItems.forEach(task => {
        if (task.status === 'upcoming' && !task.reminderSent) {
          const [time, period] = task.time.split(' ');
          const [hour, minute] = time.split(':').map(Number);
          const taskHour = period === 'PM' && hour !== 12 ? hour + 12 : (period === 'AM' && hour === 12 ? 0 : hour);
          const taskTime = taskHour * 60 + minute;

          // Send reminder before task
          if (currentTime >= taskTime - settings.reminders.preTaskMinutes && currentTime < taskTime) {
            toast({
              title: "Upcoming Task! ⏰",
              description: `"${task.task}" starts in ${settings.reminders.preTaskMinutes} minutes. Get ready!`,
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

          // Send configurable overdue reminder
          if (currentTime > taskTime + settings.reminders.overdueMinutes && task.status === 'upcoming') {
            toast({
              title: "Task Overdue ⏱️",
              description: `"${task.task}" is overdue. You can still complete it!`,
              duration: 12000,
            });
          }
        }

        // Motivational nudges for in-progress tasks (configurable timing)
        if (task.status === 'in-progress' && task.startedAt) {
          const startTime = new Date(task.startedAt);
          const elapsed = (now.getTime() - startTime.getTime()) / (1000 * 60); // minutes
          
          if (Math.floor(elapsed) === settings.reminders.motivationalNudgeMinutes) {
            toast({
              title: "Keep Going! 🔥",
              description: `You've been at "${task.task}" for ${settings.reminders.motivationalNudgeMinutes} minutes. Stay focused!`,
              duration: 6000,
            });
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [routineItems, toast, onUpdateTask, settings.reminders]);

  return null; // This component doesn't render anything
};
