import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Goal {
  id: string;
  title: string;
  progress: number;
  subGoals: SubGoal[];
  timerState: {
    isRunning: boolean;
    startTime: number | null;
    currentTime: number;
  };
}

export interface SubGoal {
  id: string;
  title: string;
  isCompleted: boolean;
  subGoals: SubGoal[];
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const { data: goalsData, error: goalsError } = await (supabase as any)
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;

      const { data: subGoalsData, error: subGoalsError } = await (supabase as any)
        .from('sub_goals')
        .select('*');

      if (subGoalsError) throw subGoalsError;

      const formattedGoals: Goal[] = (goalsData || []).map((goal: any) => {
        const goalSubGoals = buildSubGoalHierarchy(subGoalsData?.filter((sg: any) => sg.goal_id === goal.id) || []);
        
        return {
          id: goal.id,
          title: goal.title,
          progress: goal.progress || 0,
          subGoals: goalSubGoals,
          timerState: {
            isRunning: goal.timer_is_running || false,
            startTime: goal.timer_start_time || null,
            currentTime: goal.timer_current_time || 0,
          },
        };
      });

      setGoals(formattedGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildSubGoalHierarchy = (subGoals: any[]): SubGoal[] => {
    const subGoalMap = new Map();
    const rootSubGoals: SubGoal[] = [];

    // Create all sub-goals first
    subGoals.forEach((sg: any) => {
      subGoalMap.set(sg.id, {
        id: sg.id,
        title: sg.title,
        isCompleted: sg.is_completed,
        subGoals: [],
      });
    });

    // Build hierarchy
    subGoals.forEach((sg: any) => {
      const subGoal = subGoalMap.get(sg.id);
      if (sg.parent_sub_goal_id) {
        const parent = subGoalMap.get(sg.parent_sub_goal_id);
        if (parent) {
          parent.subGoals.push(subGoal);
        }
      } else {
        rootSubGoals.push(subGoal);
      }
    });

    return rootSubGoals;
  };

  const addGoal = async (title: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await (supabase as any)
        .from('goals')
        .insert({
          user_id: user.id,
          title,
          progress: 0,
          timer_is_running: false,
          timer_start_time: null,
          timer_current_time: 0,
        })
        .select()
        .single();

      if (error) throw error;

      const newGoal: Goal = {
        id: data.id,
        title: data.title,
        progress: 0,
        subGoals: [],
        timerState: {
          isRunning: false,
          startTime: null,
          currentTime: 0,
        },
      };

      setGoals(prev => [newGoal, ...prev]);
      return newGoal;
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  };

  const addSubGoal = async (goalId: string, title: string, parentSubGoalId?: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('sub_goals')
        .insert({
          goal_id: goalId,
          title,
          parent_sub_goal_id: parentSubGoalId || null,
          is_completed: false,
        })
        .select()
        .single();

      if (error) throw error;

      // Reload goals to update the UI
      await loadGoals();
      return data;
    } catch (error) {
      console.error('Error adding sub-goal:', error);
      throw error;
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    try {
      const goalUpdates: any = {};
      
      if (updates.title !== undefined) goalUpdates.title = updates.title;
      if (updates.progress !== undefined) goalUpdates.progress = updates.progress;
      if (updates.timerState) {
        goalUpdates.timer_is_running = updates.timerState.isRunning;
        goalUpdates.timer_start_time = updates.timerState.startTime;
        goalUpdates.timer_current_time = updates.timerState.currentTime;
      }

      const { error } = await (supabase as any)
        .from('goals')
        .update(goalUpdates)
        .eq('id', goalId);

      if (error) throw error;

      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      ));
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      // Delete sub-goals first
      await (supabase as any)
        .from('sub_goals')
        .delete()
        .eq('goal_id', goalId);

      // Then delete the goal
      const { error } = await (supabase as any)
        .from('goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  };

  const toggleSubGoal = async (subGoalId: string) => {
    try {
      // Get current state
      const { data: currentSubGoal, error: fetchError } = await (supabase as any)
        .from('sub_goals')
        .select('is_completed')
        .eq('id', subGoalId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await (supabase as any)
        .from('sub_goals')
        .update({ is_completed: !currentSubGoal.is_completed })
        .eq('id', subGoalId);

      if (error) throw error;

      // Reload goals to update the UI
      await loadGoals();
    } catch (error) {
      console.error('Error toggling sub-goal:', error);
      throw error;
    }
  };

  return {
    goals,
    loading,
    addGoal,
    addSubGoal,
    updateGoal,
    deleteGoal,
    toggleSubGoal,
    loadGoals,
  };
}