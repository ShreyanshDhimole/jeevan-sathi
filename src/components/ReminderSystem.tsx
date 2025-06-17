
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
  const [overdueNotificationsSent, setOverdueNotificationsSent] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = (title: string, body: string) => {
    // Show toast notification
    toast({
      title,
      description: body,
      duration: 8000,
    });

    // Show native notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 'routine-reminder',
      });
    }
  };

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
            showNotification(
              "Upcoming Task! ⏰",
              `"${task.task}" starts in ${settings.reminders.preTaskMinutes} minutes. Get ready!`
            );
            onUpdateTask(task.id, { reminderSent: true });
          }

          // Send start reminder
          if (currentTime >= taskTime && currentTime < taskTime + 5) {
            showNotification(
              "Time to Start! 🚀",
              `It's time for "${task.task}". Let's go!`
            );
          }

          // Send overdue reminder only once per task
          if (currentTime > taskTime + settings.reminders.overdueMinutes && 
              task.status === 'upcoming' && 
              !overdueNotificationsSent.has(task.id)) {
            showNotification(
              "Task Available ⏱️",
              `"${task.task}" can still be completed when you're ready.`
            );
            setOverdueNotificationsSent(prev => new Set(prev).add(task.id));
          }
        }

        // Motivational nudges for in-progress tasks (less frequent)
        if (task.status === 'in-progress' && task.startedAt) {
          const startTime = new Date(task.startedAt);
          const elapsed = (now.getTime() - startTime.getTime()) / (1000 * 60); // minutes
          
          if (Math.floor(elapsed) === settings.reminders.motivationalNudgeMinutes) {
            showNotification(
              "Keep Going! 🔥",
              `You've been at "${task.task}" for ${settings.reminders.motivationalNudgeMinutes} minutes. Stay focused!`
            );
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [routineItems, toast, onUpdateTask, settings.reminders, overdueNotificationsSent]);

  // Reset overdue notifications daily
  useEffect(() => {
    const resetDaily = () => {
      setOverdueNotificationsSent(new Set());
    };

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    const timeout = setTimeout(resetDaily, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  return null; // This component doesn't render anything
};
