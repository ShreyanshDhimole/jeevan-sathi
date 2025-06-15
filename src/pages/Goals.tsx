import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Plus, Clock, Play, Square, Trash, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

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
  const [newGoal, setNewGoal] = useState("");
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
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // New: handle addGoal via form submit
  const handleAddGoal = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    const trimmedGoal = newGoal.trim();
    if (trimmedGoal !== "") {
      const newGoalItem: Goal = {
        id: Date.now().toString(),
        title: trimmedGoal,
        progress: 0,
        subGoals: [],
        timerState: {
          isRunning: false,
          startTime: null,
          currentTime: 0,
        },
      };
      setGoals((prevGoals) => [...prevGoals, newGoalItem]);
      setNewGoal("");
      toast({
        title: "Goal Added! 🎯",
        description: `"${trimmedGoal}" has been added to your goals.`,
      });
    }
  };

  const deleteGoal = (id: string) => {
    const goalToDelete = goals.find(goal => goal.id === id);
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
    setGoals(
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
    const goal = goals.find(g => g.id === goalId);
    const subGoal = goal?.subGoals.find(sg => sg.id === subGoalId);
    
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
    const goal = goals.find(g => g.id === goalId);
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
              <span className="text-lg font-semibold text-gray-800">Goals</span>
            </div>
          </div>

          {/* UPDATE: Wrap input/button in a form to handle enter AND button click */}
          <form
            className="mb-6 flex items-center gap-4"
            onSubmit={handleAddGoal}
          >
            <Input
              type="text"
              placeholder="Add a new goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              className="flex-1"
              // Enter key on input will submit form
            />
            <Button
              type="submit"
              className="whitespace-nowrap"
              disabled={newGoal.trim().length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Goal
            </Button>
          </form>

          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    {editingGoal === goal.id ? (
                      <input
                        type="text"
                        value={goal.title}
                        onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                        onBlur={() => setEditingGoal(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingGoal(null)}
                        className="text-xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 outline-none flex-1"
                        autoFocus
                      />
                    ) : (
                      <>
                        <h3 className="text-xl font-bold text-gray-900 flex-1">{goal.title}</h3>
                        <Button
                          onClick={() => setEditingGoal(goal.id)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-gray-700"
                          title="Edit goal title"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {goal.timerState.isRunning && (
                      <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(goal.timerState.currentTime)}</span>
                      </div>
                    )}
                    {!goal.timerState.isRunning && goal.timerState.currentTime > 0 && (
                      <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(goal.timerState.currentTime)}</span>
                      </div>
                    )}
                    <Button
                      onClick={() => toggleTimer(goal.id)}
                      variant={goal.timerState.isRunning ? "destructive" : "default"}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {goal.timerState.isRunning ? (
                        <>
                          <Square className="h-4 w-4" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Start
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => deleteGoal(goal.id)}
                      variant="destructive"
                      size="sm"
                      title="Delete goal"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Overall Progress
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider
                      defaultValue={[goal.progress]}
                      max={100}
                      step={1}
                      onValueChange={(value) =>
                        updateGoal(goal.id, { progress: value[0] })
                      }
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500">{goal.progress}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-gray-800">Sub-Goals</h4>
                  {goal.subGoals.map((subGoal) => (
                    <div
                      key={subGoal.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <label className="flex items-center gap-2">
                        <Input
                          type="checkbox"
                          checked={subGoal.isCompleted}
                          onChange={(e) =>
                            updateSubGoal(goal.id, subGoal.id, {
                              isCompleted: e.target.checked,
                            })
                          }
                          className="h-5 w-5 rounded-sm border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span
                          className={subGoal.isCompleted ? "line-through text-gray-500" : "text-gray-700"}
                        >
                          {subGoal.title}
                        </span>
                      </label>
                      <Button
                        onClick={() => deleteSubGoal(goal.id, subGoal.id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700"
                        title="Delete sub-goal"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Add a sub-goal..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim() !== "") {
                          addSubGoal(goal.id, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={(e) => {
                        const input = (e.target as HTMLButtonElement).parentElement?.querySelector('input') as HTMLInputElement;
                        if (input && input.value.trim() !== "") {
                          addSubGoal(goal.id, input.value);
                          input.value = "";
                        }
                      }}
                      size="sm"
                      variant="outline"
                      title="Add sub-goal"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

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
