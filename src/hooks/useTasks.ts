import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  starred: boolean;
  duration?: number;
  preferredTime?: string;
  flexible?: boolean;
  points?: number;
  description?: string;
  completedAt?: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from Supabase
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTasks: Task[] = (data || []).map((task: any) => ({
        id: task.id,
        task: task.task,
        priority: task.priority as 'high' | 'medium' | 'low',
        completed: task.completed,
        starred: task.starred,
        duration: task.duration || undefined,
        preferredTime: task.preferred_time || undefined,
        flexible: task.flexible || undefined,
        points: task.points || undefined,
        description: task.description || undefined,
        completedAt: task.completed_at || undefined,
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (newTask: { 
    task: string; 
    priority: 'high'|'medium'|'low'; 
    preferredTime?: string; 
    flexible?: boolean;
    points?: number;
    duration?: number;
    description?: string;
  }) => {
    try {
      const { data, error } = await (supabase as any)
        .from('tasks')
        .insert({
          task: newTask.task,
          priority: newTask.priority,
          completed: false,
          starred: false,
          duration: newTask.duration ?? 30,
          preferred_time: newTask.preferredTime,
          flexible: newTask.flexible ?? false,
          points: newTask.points,
          description: newTask.description,
        })
        .select()
        .single();

      if (error) throw error;

      const formattedTask: Task = {
        id: data.id,
        task: data.task,
        priority: data.priority as 'high' | 'medium' | 'low',
        completed: data.completed,
        starred: data.starred,
        duration: data.duration || undefined,
        preferredTime: data.preferred_time || undefined,
        flexible: data.flexible || undefined,
        points: data.points || undefined,
        description: data.description || undefined,
        completedAt: data.completed_at || undefined,
      };

      setTasks(prev => [formattedTask, ...prev]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newCompleted = !task.completed;
    const completedAt = newCompleted ? new Date().toISOString() : null;

    try {
      const { error } = await (supabase as any)
        .from('tasks')
        .update({ 
          completed: newCompleted,
          completed_at: completedAt
        })
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.map(t => 
        t.id === id 
          ? { ...t, completed: newCompleted, completedAt: completedAt || undefined }
          : t
      ));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const toggleStar = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStarred = !task.starred;

    try {
      const { error } = await (supabase as any)
        .from('tasks')
        .update({ starred: newStarred })
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, starred: newStarred } : t
      ));
    } catch (error) {
      console.error('Error toggling task star:', error);
    }
  };

  return {
    tasks,
    loading,
    addTask,
    deleteTask,
    toggleComplete,
    toggleStar,
  };
}