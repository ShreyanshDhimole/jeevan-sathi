import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface RoutineItem {
  id: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  duration: number;
  preferredTime: string;
  flexible: boolean;
  status: 'pending' | 'in-progress' | 'completed';
  points: number;
  description?: string;
  notes?: string;
  completedAt?: string;
  lastCompletedDate?: string;
  streakCount: number;
  qualityRating?: number;
}

export function useSupabaseRoutine() {
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoutineItems();
  }, []);

  const loadRoutineItems = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('routine_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedItems: RoutineItem[] = (data || []).map((item: any) => ({
        id: item.id,
        task: item.task,
        priority: item.priority,
        duration: item.duration || 30,
        preferredTime: item.preferred_time || '',
        flexible: item.flexible || true,
        status: item.status || 'pending',
        points: item.points || 10,
        description: item.description,
        notes: item.notes,
        completedAt: item.completed_at,
        lastCompletedDate: item.last_completed_date,
        streakCount: item.streak_count || 0,
        qualityRating: item.quality_rating,
      }));

      setRoutineItems(formattedItems);
    } catch (error) {
      console.error('Error loading routine items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRoutineItem = async (newItem: {
    task: string;
    priority: 'high' | 'medium' | 'low';
    duration: number;
    preferredTime: string;
    flexible: boolean;
    points: number;
    description?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await (supabase as any)
        .from('routine_items')
        .insert({
          user_id: user.id,
          task: newItem.task,
          priority: newItem.priority,
          duration: newItem.duration,
          preferred_time: newItem.preferredTime,
          flexible: newItem.flexible,
          points: newItem.points,
          description: newItem.description,
          status: 'pending',
          streak_count: 0,
        })
        .select()
        .single();

      if (error) throw error;

      const formattedItem: RoutineItem = {
        id: data.id,
        task: data.task,
        priority: data.priority,
        duration: data.duration,
        preferredTime: data.preferred_time,
        flexible: data.flexible,
        status: data.status,
        points: data.points,
        description: data.description,
        notes: data.notes,
        completedAt: data.completed_at,
        lastCompletedDate: data.last_completed_date,
        streakCount: data.streak_count,
        qualityRating: data.quality_rating,
      };

      setRoutineItems(prev => [formattedItem, ...prev]);
      return formattedItem;
    } catch (error) {
      console.error('Error adding routine item:', error);
      throw error;
    }
  };

  const updateRoutineItem = async (id: string, updates: Partial<RoutineItem>) => {
    try {
      const dbUpdates: any = {};
      
      if (updates.task !== undefined) dbUpdates.task = updates.task;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
      if (updates.preferredTime !== undefined) dbUpdates.preferred_time = updates.preferredTime;
      if (updates.flexible !== undefined) dbUpdates.flexible = updates.flexible;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.points !== undefined) dbUpdates.points = updates.points;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;
      if (updates.lastCompletedDate !== undefined) dbUpdates.last_completed_date = updates.lastCompletedDate;
      if (updates.streakCount !== undefined) dbUpdates.streak_count = updates.streakCount;
      if (updates.qualityRating !== undefined) dbUpdates.quality_rating = updates.qualityRating;

      const { error } = await (supabase as any)
        .from('routine_items')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      setRoutineItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
    } catch (error) {
      console.error('Error updating routine item:', error);
      throw error;
    }
  };

  const deleteRoutineItem = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('routine_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRoutineItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting routine item:', error);
      throw error;
    }
  };

  const completeRoutineItem = async (id: string, quality: number, notes?: string) => {
    try {
      const item = routineItems.find(i => i.id === id);
      if (!item) return;

      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const completedAt = now.toISOString();

      // Calculate new streak
      const newStreak = item.lastCompletedDate === today ? item.streakCount : item.streakCount + 1;

      await updateRoutineItem(id, {
        status: 'completed',
        completedAt,
        lastCompletedDate: today,
        streakCount: newStreak,
        qualityRating: quality,
        notes,
      });

      // Update user points
      await updateUserPoints(item.points);
    } catch (error) {
      console.error('Error completing routine item:', error);
      throw error;
    }
  };

  const updateUserPoints = async (pointsToAdd: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get current points
      const { data: pointsData, error: fetchError } = await (supabase as any)
        .from('user_points')
        .select('points')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      const currentPoints = pointsData?.points || 0;
      const newPoints = currentPoints + pointsToAdd;

      if (pointsData) {
        // Update existing points
        const { error } = await (supabase as any)
          .from('user_points')
          .update({ points: newPoints })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new points record
        const { error } = await (supabase as any)
          .from('user_points')
          .insert({ user_id: user.id, points: newPoints });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating user points:', error);
    }
  };

  return {
    routineItems,
    loading,
    addRoutineItem,
    updateRoutineItem,
    deleteRoutineItem,
    completeRoutineItem,
    loadRoutineItems,
  };
}