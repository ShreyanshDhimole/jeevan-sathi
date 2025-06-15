import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useToast } from "@/hooks/use-toast";

// New imports for refactoring:
import AddGoalForm from "@/components/goals/AddGoalForm";
import GoalList from "@/components/goals/GoalList";

interface Goal {
  id: string;
  title: string;
  progress: number;
  subGoals: { id: string; title: string; isCompleted: boolean }[];
  timerState: {
    isRunning: boolean;
    startTime: number | null;
    currentTime: number;
  };
}

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedGoals = localStorage.getItem("goals");
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ADD GOAL - moved here for the form component
  const handleAddGoal = (goalTitle: string) => {
    console.log("handleAddGoal called with:", goalTitle);
    const newGoalItem: Goal = {
      id: Date.now().toString(),
      title: goalTitle,
      progress: 0,
      subGoals: [],
      timerState: {
        isRunning: false,
        startTime: null,
        currentTime: 0,
      },
    };
    console.log("Created new goal:", newGoalItem);
    setGoals((prevGoals) => {
      console.log("Previous goals:", prevGoals);
      const newGoals = [...prevGoals, newGoalItem];
      console.log("New goals array:", newGoals);
      return newGoals;
    });
    toast({
      title: "Goal Added! 🎯",
      description: `"${goalTitle}" has been added to your goals.`,
    });
    console.log("Toast should be shown");
  };

  const deleteGoal = (id: string) => {
    const goalToDelete = goals.find((goal) => goal.id === id);
    setGoals(goals.filter((goal) => goal.id !== id));
    if (goalToDelete) {
      toast({
        title: "Goal Deleted",
        description: `"${goalToDelete.title}" has been removed.`,
        variant: "destructive",
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
      toast({
        title: "Sub-goal Added! ✨",
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
      toast({
        title: "Sub-goal Deleted",
        description: `"${subGoal.title}" has been removed.`,
        variant: "destructive",
      });
    }
  };

  const toggleTimer = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          if (goal.timerState.isRunning) {
            toast({
              title: "Timer Stopped ⏹️",
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
            toast({
              title: "Timer Started ▶️",
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-stretch xl:px-8 px-4 pt-6 bg-transparent">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              {/* SVG icon and title */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-purple-600"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                <path d="M10 3v4a2 2 0 0 1-2 2H2" />
                <path d="M14 3v4a2 2 0 0 0 2 2h6" />
              </svg>
              <span className="text-lg font-semibold text-gray-800">
                Goals
              </span>
            </div>
          </div>

          {/* ADD NEW GOAL FORM */}
          <AddGoalForm onAddGoal={handleAddGoal} />

          {/* GOALS LIST */}
          <GoalList
            goals={goals}
            editingGoal={editingGoal}
            setEditingGoal={setEditingGoal}
            updateGoal={updateGoal}
            deleteGoal={deleteGoal}
            toggleTimer={toggleTimer}
            updateSubGoal={updateSubGoal}
            addSubGoal={addSubGoal}
            deleteSubGoal={deleteSubGoal}
            formatTime={formatTime}
          />

          {goals.length === 0 && (
            <div className="text-center py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10 text-gray-400 mx-auto mb-3"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                <path d="M10 3v4a2 2 0 0 1-2 2H2" />
                <path d="M14 3v4a2 2 0 0 0 2 2h6" />
              </svg>
              <p className="text-gray-500">No goals yet. Start adding some!</p>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Goals;
