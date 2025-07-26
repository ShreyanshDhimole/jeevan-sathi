import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  type: 'reminder' | 'note';
  category: string;
  reminderTime?: string;
  alarmSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useSupabaseReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('reminders_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReminders: Reminder[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type,
        category: item.category,
        reminderTime: item.reminder_time,
        alarmSent: item.alarm_sent,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      setReminders(formattedReminders);
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const addReminder = async (reminder: {
    title: string;
    description?: string;
    type: 'reminder' | 'note';
    category: string;
    reminderTime?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await (supabase as any)
        .from('reminders_notes')
        .insert({
          user_id: user.id,
          title: reminder.title,
          description: reminder.description,
          type: reminder.type,
          category: reminder.category,
          reminder_time: reminder.reminderTime,
          alarm_sent: false,
        })
        .select()
        .single();

      if (error) throw error;

      const formattedReminder: Reminder = {
        id: data.id,
        title: data.title,
        description: data.description,
        type: data.type,
        category: data.category,
        reminderTime: data.reminder_time,
        alarmSent: data.alarm_sent,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setReminders(prev => [formattedReminder, ...prev]);
      return formattedReminder;
    } catch (error) {
      console.error('Error adding reminder:', error);
      throw error;
    }
  };

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    try {
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.reminderTime !== undefined) dbUpdates.reminder_time = updates.reminderTime;
      if (updates.alarmSent !== undefined) dbUpdates.alarm_sent = updates.alarmSent;

      const { error } = await (supabase as any)
        .from('reminders_notes')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      setReminders(prev => prev.map(reminder => 
        reminder.id === id ? { ...reminder, ...updates } : reminder
      ));
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('reminders_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReminders(prev => prev.filter(reminder => reminder.id !== id));
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  };

  return {
    reminders,
    loading,
    addReminder,
    updateReminder,
    deleteReminder,
    loadReminders,
  };
}