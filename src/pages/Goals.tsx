import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Target, TrendingUp, Calendar, Plus, Edit, Trophy, Play, Pause, Square, Clock, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface SubGoal {
  id: string;
  title: string;
  completed: boolean;
  subGoals: SubGoal[];
  createdAt: string;
}

interface TimerSession {
  date: string;
  duration: number; // in minutes
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  deadline: string;
  category: string;
  dailyTarget: string;
  status: 'on-track' | 'behind' | 'ahead';
  subGoals: SubGoal[];
  timerState: {
    isRunning: boolean;
    startTime: number | null;
    totalTime: number; // total minutes spent
    todayTime: number; // minutes spent today
  };
  sessions: TimerSession[];
}

const Goals = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([
    { 
      id: '1',
      title: "Learn Python", 
      progress: 0, 
      deadline: "30 days", 
      category: "Learning",
      dailyTarget: "Study 1 hour daily",
      status: 'on-track',
      subGoals: [
        {
          id: '1-1',
          title: "Python Basics",
          completed: false,
          subGoals: [
            { id: '1-1-1', title: "Variables and Data Types", completed: false, subGoals: [], createdAt: new Date().toISOString() },
            { id: '1-1-2', title: "Control Structures", completed: false, subGoals: [], createdAt: new Date().toISOString() }
          ],
          createdAt: new Date().toISOString()
        },
        {
          id: '1-2',
          title: "Data Structures",
          completed: false,
          subGoals: [],
          createdAt: new Date().toISOString()
        }
      ],
      timerState: {
        isRunning: false,
        startTime: null,
        totalTime: 0,
        todayTime: 0
      },
      sessions: []
    },
    { 
      id: '2',
      title: "Machine Learning", 
      progress: 0, 
      deadline: "60 days", 
      category: "Learning",
      dailyTarget: "Study and practice daily",
      status: 'on-track',
      subGoals: [
        {
          id: '2-1',
          title: "Mathematics Foundation",
          completed: false,
          subGoals: [
            {
              id: '2-1-1',
              title: "Linear Algebra",
              completed: false,
              subGoals: [],
              createdAt: new Date().toISOString()
            },
            {
              id: '2-1-2',
              title: "Probability & Statistics",
              completed: false,
              subGoals: [
                { id: '2-1-2-1', title: "Basic Probability", completed: false, subGoals: [], createdAt: new Date().toISOString() },
                { id: '2-1-2-2', title: "Distributions", completed: false, subGoals: [], createdAt: new Date().toISOString() }
              ],
              createdAt: new Date().toISOString()
            }
          ],
          createdAt: new Date().toISOString()
        }
      ],
      timerState: {
        isRunning: false,
        startTime: null,
        totalTime: 0,
        todayTime: 0
      },
      sessions: []
    }
  ]);

  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  const [newSubGoal, setNewSubGoal] = useState<{ [key: string]: string }>({});

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGoals(prevGoals => 
        prevGoals.map(goal => {
          if (goal.timerState.isRunning && goal.timerState.startTime) {
            const elapsed = Math.floor((Date.now() - goal.timerState.startTime) / 60000);
            return {
              ...goal,
              timerState: {
                ...goal.timerState,
                todayTime: goal.timerState.todayTime + elapsed,
                totalTime: goal.timerState.totalTime + elapsed,
                startTime: Date.now()
              }
            };
          }
          return goal;
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const addNewGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: "New Goal",
      progress: 0,
      deadline: "30 days",
      category: "General",
      dailyTarget: "Work on goal daily",
      status: 'on-track',
      subGoals: [],
      timerState: {
        isRunning: false,
        startTime: null,
        totalTime: 0,
        todayTime: 0
      },
      sessions: []
    };

    setGoals(prev => [...prev, newGoal]);
    toast({
      title: "Goal Added",
      description: "New goal has been created successfully!",
    });
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast({
      title: "Goal Deleted",
      description: "Goal has been removed successfully!",
    });
  };

  const deleteSubGoal = (goalId: string, subGoalId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedSubGoals = removeSubGoalFromArray(goal.subGoals, subGoalId);
        const newProgress = calculateProgress(updatedSubGoals);
        return { 
          ...goal, 
          subGoals: updatedSubGoals,
          progress: newProgress
        };
      }
      return goal;
    }));
    
    toast({
      title: "Sub-goal Deleted",
      description: "Sub-goal has been removed successfully!",
    });
  };

  const removeSubGoalFromArray = (subGoals: SubGoal[], targetId: string): SubGoal[] => {
    return subGoals.filter(subGoal => subGoal.id !== targetId)
                   .map(subGoal => ({
                     ...subGoal,
                     subGoals: removeSubGoalFromArray(subGoal.subGoals, targetId)
                   }));
  };

  const editGoalTitle = (goalId: string, newTitle: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, title: newTitle } : goal
    ));
  };

  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const startEditing = (goalId: string, currentTitle: string) => {
    setEditingGoal(goalId);
    setEditTitle(currentTitle);
  };

  const saveEdit = (goalId: string) => {
    if (editTitle.trim()) {
      editGoalTitle(goalId, editTitle.trim());
      toast({
        title: "Goal Updated",
        description: "Goal title has been updated successfully!",
      });
    }
    setEditingGoal(null);
    setEditTitle("");
  };

  const startTimer = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            timerState: { 
              ...goal.timerState, 
              isRunning: true, 
              startTime: Date.now() 
            } 
          }
        : goal
    ));
  };

  const pauseTimer = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            timerState: { 
              ...goal.timerState, 
              isRunning: false, 
              startTime: null 
            } 
          }
        : goal
    ));
  };

  const stopTimer = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            timerState: { 
              ...goal.timerState, 
              isRunning: false, 
              startTime: null 
            },
            sessions: [
              ...goal.sessions,
              {
                date: new Date().toISOString().split('T')[0],
                duration: goal.timerState.todayTime
              }
            ]
          }
        : goal
    ));
  };

  const calculateProgress = (subGoals: SubGoal[]): number => {
    if (subGoals.length === 0) return 0;
    
    const totalSubGoals = countAllSubGoals(subGoals);
    const completedSubGoals = countCompletedSubGoals(subGoals);
    
    return totalSubGoals > 0 ? Math.round((completedSubGoals / totalSubGoals) * 100) : 0;
  };

  const countAllSubGoals = (subGoals: SubGoal[]): number => {
    return subGoals.reduce((count, subGoal) => {
      return count + 1 + countAllSubGoals(subGoal.subGoals);
    }, 0);
  };

  const countCompletedSubGoals = (subGoals: SubGoal[]): number => {
    return subGoals.reduce((count, subGoal) => {
      const currentCount = subGoal.completed ? 1 : 0;
      return count + currentCount + countCompletedSubGoals(subGoal.subGoals);
    }, 0);
  };

  const toggleSubGoal = (goalId: string, subGoalId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedSubGoals = toggleSubGoalInArray(goal.subGoals, subGoalId);
        const newProgress = calculateProgress(updatedSubGoals);
        return { 
          ...goal, 
          subGoals: updatedSubGoals,
          progress: newProgress
        };
      }
      return goal;
    }));
  };

  const toggleSubGoalInArray = (subGoals: SubGoal[], targetId: string): SubGoal[] => {
    return subGoals.map(subGoal => {
      if (subGoal.id === targetId) {
        return { ...subGoal, completed: !subGoal.completed };
      }
      if (subGoal.subGoals.length > 0) {
        return { ...subGoal, subGoals: toggleSubGoalInArray(subGoal.subGoals, targetId) };
      }
      return subGoal;
    });
  };

  const addSubGoal = (goalId: string, parentId?: string) => {
    const title = newSubGoal[parentId || goalId];
    if (!title?.trim()) return;

    const newSubGoalObj: SubGoal = {
      id: `${goalId}-${Date.now()}`,
      title: title.trim(),
      completed: false,
      subGoals: [],
      createdAt: new Date().toISOString()
    };

    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        if (!parentId) {
          return { ...goal, subGoals: [...goal.subGoals, newSubGoalObj] };
        }
        return { ...goal, subGoals: addSubGoalToArray(goal.subGoals, parentId, newSubGoalObj) };
      }
      return goal;
    }));

    setNewSubGoal(prev => ({ ...prev, [parentId || goalId]: '' }));
  };

  const addSubGoalToArray = (subGoals: SubGoal[], parentId: string, newSubGoal: SubGoal): SubGoal[] => {
    return subGoals.map(subGoal => {
      if (subGoal.id === parentId) {
        return { ...subGoal, subGoals: [...subGoal.subGoals, newSubGoal] };
      }
      if (subGoal.subGoals.length > 0) {
        return { ...subGoal, subGoals: addSubGoalToArray(subGoal.subGoals, parentId, newSubGoal) };
      }
      return subGoal;
    });
  };

  const toggleExpanded = (id: string) => {
    setExpandedGoals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const renderSubGoals = (subGoals: SubGoal[], goalId: string, level = 0) => {
    return subGoals.map(subGoal => (
      <div key={subGoal.id} className={`ml-${level * 4} border-l-2 border-gray-200 pl-4 mb-2`}>
        <div className="flex items-center gap-2 mb-2">
          {subGoal.subGoals.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-4 w-4"
              onClick={() => toggleExpanded(subGoal.id)}
            >
              {expandedGoals.has(subGoal.id) ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          <Checkbox
            checked={subGoal.completed}
            onCheckedChange={() => toggleSubGoal(goalId, subGoal.id)}
          />
          <span className={`text-sm flex-1 ${subGoal.completed ? 'line-through text-gray-500' : ''}`}>
            {subGoal.title}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => deleteSubGoal(goalId, subGoal.id)}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        
        {expandedGoals.has(subGoal.id) && subGoal.subGoals.length > 0 && (
          <div className="ml-4">
            {renderSubGoals(subGoal.subGoals, goalId, level + 1)}
          </div>
        )}
        
        <div className="flex items-center gap-2 ml-6 mb-2">
          <Input
            placeholder="Add sub-goal..."
            value={newSubGoal[subGoal.id] || ''}
            onChange={(e) => setNewSubGoal(prev => ({ ...prev, [subGoal.id]: e.target.value }))}
            className="text-xs h-7"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addSubGoal(goalId, subGoal.id);
              }
            }}
          />
          <Button
            size="sm"
            onClick={() => addSubGoal(goalId, subGoal.id)}
            className="h-7 px-2"
            disabled={!newSubGoal[subGoal.id]?.trim()}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'text-green-600';
      case 'behind': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-stretch xl:px-8 px-4 pt-6 bg-transparent">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-semibold text-gray-800">Goals</span>
            </div>
          </div>

          <div className="mb-6">
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={addNewGoal}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Goal
            </Button>
          </div>
          
          <div className="space-y-6">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    {editingGoal === goal.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="text-lg font-bold"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              saveEdit(goal.id);
                            }
                          }}
                        />
                        <Button size="sm" onClick={() => saveEdit(goal.id)}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingGoal(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-bold text-gray-900">{goal.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {goal.deadline}
                          </div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {goal.category}
                          </span>
                          <span className={`font-medium ${getStatusColor(goal.status)}`}>
                            {goal.status.replace('-', ' ')}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getStatusColor(goal.status)}`}>
                        {goal.progress}%
                      </div>
                      <div className="flex items-center gap-1">
                        {goal.status === 'ahead' && <Trophy className="h-4 w-4 text-green-500" />}
                        <TrendingUp className={`h-4 w-4 ${getStatusColor(goal.status)}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timer Section */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Time Tracking</span>
                    </div>
                    <div className="flex gap-2">
                      {!goal.timerState.isRunning ? (
                        <Button
                          size="sm"
                          onClick={() => startTimer(goal.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => pauseTimer(goal.id)}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => stopTimer(goal.id)}
                        variant="outline"
                      >
                        <Square className="h-3 w-3 mr-1" />
                        Stop
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Today: {formatTime(goal.timerState.todayTime)}</span>
                    <span>Total: {formatTime(goal.timerState.totalTime)}</span>
                  </div>
                  {goal.timerState.isRunning && (
                    <div className="mt-1 text-xs text-green-600 font-medium">Timer Running...</div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        goal.status === 'ahead' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                        goal.status === 'behind' ? 'bg-gradient-to-r from-red-500 to-orange-600' :
                        'bg-gradient-to-r from-blue-500 to-purple-600'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Sub-goals Section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700">Sub-goals</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleExpanded(goal.id)}
                    >
                      {expandedGoals.has(goal.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {expandedGoals.has(goal.id) && (
                    <div className="space-y-2">
                      {renderSubGoals(goal.subGoals, goal.id)}
                      
                      <div className="flex items-center gap-2 mt-3">
                        <Input
                          placeholder="Add new sub-goal..."
                          value={newSubGoal[goal.id] || ''}
                          onChange={(e) => setNewSubGoal(prev => ({ ...prev, [goal.id]: e.target.value }))}
                          className="text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addSubGoal(goal.id);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={() => addSubGoal(goal.id)}
                          disabled={!newSubGoal[goal.id]?.trim()}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => startEditing(goal.id, goal.title)}
                      title="Edit goal title"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete goal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Goals;
