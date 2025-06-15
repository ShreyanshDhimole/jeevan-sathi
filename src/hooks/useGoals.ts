import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import { formatTime } from "@/utils/formatTime";

export interface SubGoal {
  id: string;
  title: string;
  isCompleted: boolean;
}

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

export function useGoals() {
  // NEW: Debug mount
  console.log("useGoals: hook is mounting"); // DEBUG

  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);

  // Sync from localStorage on mount
  useEffect(() => {
    try {
      const storedGoals = localStorage.getItem("goals");
      if (storedGoals) setGoals(JSON.parse(storedGoals));
    } catch (error) {
      toast.error("Could not load goals", {
        description:
          "There was an error reading your goals from storage. Your browser settings might be blocking it.",
      });
    }
  }, []);

  // Save goals to localStorage when goals change
  useEffect(() => {
    try {
      localStorage.setItem("goals", JSON.stringify(goals));
      console.log("useGoals: goals saved to localStorage:", goals); // DEBUG
    } catch (error) {
      toast.error("Could not save goals", {
        description:
          "There was an error saving your goals. Your browser settings might be blocking it.",
      });
    }
  }, [goals]);

  const handleAddGoal = useCallback((goalTitle: string) => {
    const trimmed = goalTitle.trim();
    console.log("useGoals: handleAddGoal called with:", trimmed); // DEBUG
    if (!trimmed) return;
    const newGoalItem: Goal = {
      id: Date.now().toString(),
      title: trimmed,
      progress: 0,
      subGoals: [],
      timerState: {
        isRunning: false,
        startTime: null,
        currentTime: 0,
      },
    };
    setGoals((prevGoals) => {
      const newGoals = [...prevGoals, newGoalItem];
      console.log("useGoals: setGoals called, new goals state:", newGoals); // DEBUG
      return newGoals;
    });
    toast.success("Goal Added! 🎯", {
      description: `"${trimmed}" has been added to your goals.`,
    });
  }, []);

  const deleteGoal = (id: string) => {
    const goalToDelete = goals.find((goal) => goal.id === id);
    setGoals(goals.filter((goal) => goal.id !== id));
    if (goalToDelete) {
      toast.error("Goal Deleted", {
        description: `"${goalToDelete.title}" has been removed.`,
      });
    }
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((goals) =>
      goals.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
    );
  };

  const updateSubGoal = (
    goalId: string,
    subGoalId: string,
    updates: Partial<{ title: string; isCompleted: boolean }>
  ) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            subGoals: goal.subGoals.map((subGoal) =>
              subGoal.id === subGoalId ? { ...subGoal, ...updates } : subGoal
            ),
          };
        }
        return goal;
      })
    );
  };

  const addSubGoal = (goalId: string, subGoalTitle: string) => {
    if (subGoalTitle.trim() !== "") {
      const newSubGoal = {
        id: Date.now().toString(),
        title: subGoalTitle,
        isCompleted: false,
      };
      setGoals(
        goals.map((goal) =>
          goal.id === goalId
            ? { ...goal, subGoals: [...goal.subGoals, newSubGoal] }
            : goal
        )
      );
      toast.success("Sub-goal Added! ✨", {
        description: `"${subGoalTitle}" has been added as a sub-goal.`,
      });
    }
  };

  const deleteSubGoal = (goalId: string, subGoalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    const subGoal = goal?.subGoals.find((sg) => sg.id === subGoalId);

    setGoals(
      goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              subGoals: goal.subGoals.filter(
                (subGoal) => subGoal.id !== subGoalId
              ),
            }
          : goal
      )
    );

    if (subGoal) {
      toast.error("Sub-goal Deleted", {
        description: `"${subGoal.title}" has been removed.`,
      });
    }
  };

  const toggleTimer = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          if (goal.timerState.isRunning) {
            toast.info("Timer Stopped ⏹️", {
              description: `Timer for "${goal.title}" has been stopped.`,
            });
            return {
              ...goal,
              timerState: {
                ...goal.timerState,
                isRunning: false,
                startTime: null,
              },
            };
          } else {
            toast.info("Timer Started ▶️", {
              description: `Timer for "${goal.title}" is now running.`,
            });
            return {
              ...goal,
              timerState: {
                ...goal.timerState,
                isRunning: true,
                startTime: Date.now(),
              },
            };
          }
        }
        return goal;
      })
    );
  };

  // Handle timer tick
  useEffect(() => {
    const intervalId = setInterval(() => {
      setGoals((prevGoals) =>
        prevGoals.map((goal) => {
          if (goal.timerState.isRunning && goal.timerState.startTime) {
            const currentTime = Math.floor(
              (Date.now() - goal.timerState.startTime) / 1000
            );
            return {
              ...goal,
              timerState: {
                ...goal.timerState,
                currentTime: currentTime,
              },
            };
          }
          return goal;
        })
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return {
    goals,
    editingGoal,
    setEditingGoal,
    handleAddGoal,
    deleteGoal,
    updateGoal,
    updateSubGoal,
    addSubGoal,
    deleteSubGoal,
    toggleTimer,
    formatTime,
  };
}
