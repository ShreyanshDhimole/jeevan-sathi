import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UserPoints {
  points: number;
  userId: string;
  updatedAt: string;
}

export function useSupabasePoints() {
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPoints();
  }, []);

  const loadPoints = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await (supabase as any)
        .from('user_points')
        .select('points')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setPoints(data?.points || 0);
    } catch (error) {
      console.error('Error loading points:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePoints = async (newPoints: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if points record exists
      const { data: existingPoints, error: fetchError } = await (supabase as any)
        .from('user_points')
        .select('points')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (existingPoints) {
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

      setPoints(newPoints);
    } catch (error) {
      console.error('Error updating points:', error);
      throw error;
    }
  };

  const addPoints = async (pointsToAdd: number) => {
    const newTotal = points + pointsToAdd;
    await updatePoints(newTotal);
  };

  const subtractPoints = async (pointsToSubtract: number) => {
    const newTotal = Math.max(0, points - pointsToSubtract);
    await updatePoints(newTotal);
  };

  return {
    points,
    loading,
    updatePoints,
    addPoints,
    subtractPoints,
    loadPoints,
  };
}