import { useState, useEffect, useCallback } from "react";

export interface Task {
  id: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  starred: boolean;
  duration?: number; // New: task duration (minutes)
  preferredTime?: string;
  flexible?: boolean;
  points?: number;
  description?: string;
  completedAt?: string; // <-- Added to support usages in dashboard and stats
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tasks");
      if (stored) setTasks(JSON.parse(stored));
      else {
        // Demo initial tasks
        setTasks([
          { id: '1', task: "Complete project proposal", priority: "high", completed: false, starred: false },
          { id: '2', task: "Call insurance company", priority: "medium", completed: true, starred: false },
          { id: '3', task: "Buy groceries", priority: "low", completed: false, starred: true },
          { id: '4', task: "Schedule dentist appointment", priority: "medium", completed: false, starred: false },
          { id: '5', task: "Review team feedback", priority: "high", completed: true, starred: true },
        ]);
      }
    } catch (e) {
      // fallback to empty
      setTasks([]);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  const addTask = (newTask: { 
    task: string; 
    priority: 'high'|'medium'|'low'; 
    preferredTime?: string; 
    flexible?: boolean;
    points?: number;
    duration?: number;
    description?: string;
  }) => {
    const t: Task = {
      id: Date.now().toString(),
      task: newTask.task,
      priority: newTask.priority,
      completed: false,
      starred: false,
      duration: newTask.duration ?? 30, // <--- ensure duration is always set
      preferredTime: newTask.preferredTime,
      flexible: newTask.flexible,
      points: newTask.points,
      description: newTask.description,
    };
    setTasks(prev => [...prev, t]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleStar = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, starred: !t.starred } : t));
  };

  return {
    tasks,
    addTask,
    deleteTask,
    toggleComplete,
    toggleStar,
  };
}