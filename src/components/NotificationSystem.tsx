
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RoutineItem } from '@/types/routine';

interface NotificationSystemProps {
  routineItems: RoutineItem[];
  onUpdateTask: (taskId: string, updates: Partial<RoutineItem>) => void;
}

export const NotificationSystem = ({ routineItems, onUpdateTask }: NotificationSystemProps) => {
  const { toast } = useToast();

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = (title: string, body: string, icon?: string) => {
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
        icon: icon || '/favicon.ico',
        tag: 'routine-reminder',
      });
    }
  };

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      routineItems.forEach(task => {
        if (task.status === 'upcoming' && !task.reminderSent) {
          const [time, period] = task.time.split(' ');
          const [hour, minute] = time.split(':').map(Number);
          const taskHour = period === 'PM' && hour !== 12 ? hour + 12 : (period === 'AM' && hour === 12 ? 0 : hour);
          const taskTime = taskHour * 60 + minute;

          // Send reminder 5 minutes before task
          if (currentTime >= taskTime - 5 && currentTime < taskTime) {
            showNotification(
              "📅 Upcoming Task!",
              `"${task.task}" starts in 5 minutes. Get ready!`,
              '⏰'
            );
            onUpdateTask(task.id, { reminderSent: true });
          }

          // Send start reminder
          if (currentTime >= taskTime && currentTime < taskTime + 2) {
            showNotification(
              "🚀 Time to Start!",
              `It's time for "${task.task}". Let's begin!`,
              '🎯'
            );
          }

          // Send overdue reminder
          if (currentTime > taskTime + 15 && task.status === 'upcoming') {
            showNotification(
              "⏱️ Task Available",
              `"${task.task}" is still available to complete when you're ready.`,
              '💪'
            );
          }
        }

        // Motivational nudges for in-progress tasks
        if (task.status === 'in-progress' && task.startedAt) {
          const startTime = new Date(task.startedAt);
          const elapsed = (now.getTime() - startTime.getTime()) / (1000 * 60); // minutes
          
          if (Math.floor(elapsed) === 15) {
            showNotification(
              "🔥 Keep Going!",
              `You've been working on "${task.task}" for 15 minutes. Stay focused!`,
              '💪'
            );
          }
        }
      });
    };

    const interval = setInterval(checkNotifications, 60000); // Check every minute
    checkNotifications(); // Check immediately

    return () => clearInterval(interval);
  }, [routineItems, toast, onUpdateTask]);

  return null; // This component doesn't render anything
};
