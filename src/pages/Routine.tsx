import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Clock, Plus, CheckCircle, AlertTriangle, RotateCcw, Star, Play, Trophy, Zap, Calendar } from "lucide-react";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { RecalibrateDialog } from "@/components/RecalibrateDialog";
import { UrgentTaskDialog } from "@/components/UrgentTaskDialog";
import { TaskTracker } from "@/components/TaskTracker";
import { ReminderSystem } from "@/components/ReminderSystem";
import { StreakRewards } from "@/components/StreakRewards";
import { RoutineCalendar } from "@/components/RoutineCalendar";
import { RoutineItem, CompletionRecord, StreakReward } from "@/types/routine";
import { recalibrateWithUrgentTask } from "@/utils/recalibrationLogic";
import { useToast } from "@/hooks/use-toast";
import { Celebration } from "@/components/Celebration"; // Only for streak reward

const Routine = () => {
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([
    { 
      id: '1', 
      time: "6:00 AM", 
      task: "Naam Jaap", 
      status: "completed", 
      priority: "high", 
      flexible: true,
      points: 75,
      streak: 12,
      quality: 5,
      completionHistory: [],
      lastCompleted: new Date().toISOString(),
      duration: 30,
      compressible: true,
      minDuration: 15
    },
    { 
      id: '2', 
      time: "7:00 AM", 
      task: "Morning Exercise", 
      status: "completed", 
      priority: "medium", 
      flexible: true,
      points: 50,
      streak: 8,
      completionHistory: [],
      duration: 45,
      compressible: true,
      minDuration: 20
    },
    { 
      id: '3', 
      time: "8:00 AM", 
      task: "Breakfast", 
      status: "current", 
      priority: "high", 
      flexible: false,
      points: 25,
      streak: 15,
      completionHistory: [],
      duration: 30,
      compressible: false
    },
    { 
      id: '4', 
      time: "9:00 AM", 
      task: "Work Focus Time", 
      status: "upcoming", 
      priority: "high", 
      flexible: true,
      points: 100,
      streak: 5,
      completionHistory: [],
      duration: 90,
      compressible: true,
      minDuration: 60,
      dependsOn: '3'
    },
    { 
      id: '5', 
      time: "11:00 AM", 
      task: "Client Meeting", 
      status: "upcoming", 
      priority: "high", 
      flexible: false,
      points: 150,
      streak: 0,
      completionHistory: [],
      duration: 60,
      compressible: false
    },
  ]);

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isRecalibrateOpen, setIsRecalibrateOpen] = useState(false);
  const [isUrgentTaskOpen, setIsUrgentTaskOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<RoutineItem | null>(null);
  const [isTaskTrackerOpen, setIsTaskTrackerOpen] = useState(false);
  const [streakReward, setStreakReward] = useState<StreakReward | null>(null);
  const [isStreakRewardOpen, setIsStreakRewardOpen] = useState(false);
  const [totalPoints, setTotalPoints] = useState(1450);
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateRoutineStatus();
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const updateRoutineStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    setRoutineItems(prev => prev.map(item => {
      const [time, period] = item.time.split(' ');
      const [hour, minute] = time.split(':').map(Number);
      const itemHour = period === 'PM' && hour !== 12 ? hour + 12 : (period === 'AM' && hour === 12 ? 0 : hour);
      
      const itemTime = itemHour * 60 + minute;
      const nowTime = currentHour * 60 + currentMinute;

      if (item.status === 'upcoming' && nowTime > itemTime + 30) {
        return { ...item, status: 'missed' as const };
      }
      if (item.status === 'upcoming' && nowTime >= itemTime - 15 && nowTime <= itemTime + 15) {
        return { ...item, status: 'current' as const };
      }
      return item;
    }));
  };

  const addTask = (newTask: { task: string; priority: 'high' | 'medium' | 'low'; preferredTime: string; flexible: boolean; points: number }) => {
    const newId = (routineItems.length + 1).toString();
    const newRoutineItem: RoutineItem = {
      id: newId,
      time: newTask.preferredTime,
      task: newTask.task,
      status: 'upcoming',
      priority: newTask.priority,
      flexible: newTask.flexible,
      points: newTask.points,
      streak: 0,
      completionHistory: [],
      duration: 60,
      compressible: newTask.flexible
    };

    setRoutineItems(prev => [...prev, newRoutineItem].sort((a, b) => {
      const timeA = convertTimeToMinutes(a.time);
      const timeB = convertTimeToMinutes(b.time);
      return timeA - timeB;
    }));

    toast({
      title: "Task Added! 📝",
      description: `"${newTask.task}" has been added to your routine with ${newTask.points} points.`,
    });
  };

  const convertTimeToMinutes = (time: string) => {
    const [timeStr, period] = time.split(' ');
    const [hour, minute] = timeStr.split(':').map(Number);
    const hour24 = period === 'PM' && hour !== 12 ? hour + 12 : (period === 'AM' && hour === 12 ? 0 : hour);
    return hour24 * 60 + minute;
  };

  const handleTaskStart = (taskId: string) => {
    setRoutineItems(prev => prev.map(item => 
      item.id === taskId ? { 
        ...item, 
        status: 'in-progress' as const, 
        startedAt: new Date().toISOString() 
      } : item
    ));
  };

  const handleTaskComplete = (taskId: string, quality: number, notes: string, duration: number) => {
    const task = routineItems.find(t => t.id === taskId);
    if (!task) return;

    const newStreak = task.streak + 1;
    const completionRecord: CompletionRecord = {
      date: new Date().toISOString(),
      quality,
      duration,
      notes,
      pointsEarned: task.points
    };

    // Celebration only for streak rewards
    if (newStreak === 7 || newStreak === 14 || newStreak === 30 || newStreak % 30 === 0) {
      const reward = getStreakReward(newStreak);
      setStreakReward(reward);
      setIsStreakRewardOpen(true);
      setTotalPoints(prev => prev + task.points + reward.bonusPoints);
      setShowCelebration(true); // celebration for streak reward only
    } else {
      setTotalPoints(prev => prev + task.points);
      // setShowCelebration(false); // do not show celebration for normal tasks
    }

    setRoutineItems(prev => prev.map(item => 
      item.id === taskId ? { 
        ...item, 
        status: 'completed' as const,
        streak: newStreak,
        quality,
        lastCompleted: new Date().toISOString(),
        completionHistory: [...item.completionHistory, completionRecord],
        startedAt: undefined
      } : item
    ));
  };

  const getStreakReward = (streak: number): StreakReward => {
    if (streak >= 30) {
      return {
        streakDays: streak,
        bonusPoints: 200,
        title: "Consistency Master!",
        description: "You've maintained this habit for a month! This is incredible dedication."
      };
    } else if (streak >= 14) {
      return {
        streakDays: streak,
        bonusPoints: 100,
        title: "Habit Champion!",
        description: "Two weeks of consistency! You're building strong habits."
      };
    } else {
      return {
        streakDays: streak,
        bonusPoints: 50,
        title: "Week Warrior!",
        description: "One full week of consistency! Great job building this habit."
      };
    }
  };

  const handleTaskClick = (task: RoutineItem) => {
    if (task.status === 'current' || task.status === 'in-progress') {
      setSelectedTask(task);
      setIsTaskTrackerOpen(true);
    }
    // Removed the notes modal functionality for routine tasks
  };

  const updateTask = (taskId: string, updates: Partial<RoutineItem>) => {
    setRoutineItems(prev => prev.map(item => 
      item.id === taskId ? { ...item, ...updates } : item
    ));
  };

  const handleMissedTask = (task: RoutineItem) => {
    setTotalPoints(prev => Math.max(0, prev - task.points));
    toast({
      title: "Task Missed 😔",
      description: `You lost ${task.points} points for missing "${task.task}". Don't give up!`,
      variant: "destructive",
    });
  };

  const recalibrateRoutine = () => {
    const missedTasks = routineItems.filter(item => item.status === 'missed' && item.flexible);
    const upcomingTasks = routineItems.filter(item => item.status === 'upcoming');
    
    // Logic to reschedule missed flexible tasks
    console.log('Recalibrating routine with missed tasks:', missedTasks);
    setIsRecalibrateOpen(true);
  };

  const handleUrgentTask = (taskDescription: string, duration: number) => {
    const result = recalibrateWithUrgentTask(routineItems, { task: taskDescription, duration }, currentTime);
    
    if (result.success) {
      setRoutineItems(result.adjustedTasks);
      
      let toastMessage = result.message;
      if (result.compressions.length > 0) {
        const compressedTasks = result.compressions.map(c => 
          routineItems.find(t => t.id === c.taskId)?.task
        ).join(', ');
        toastMessage += ` Compressed: ${compressedTasks}`;
      }
      
      toast({
        title: "Routine Recalibrated! ⚡",
        description: toastMessage,
      });
    } else {
      toast({
        title: "Recalibration Failed 😔",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const getMissedTasksCount = () => routineItems.filter(item => item.status === 'missed').length;

  return (
    <SidebarProvider>
      {/* Celebration confetti (ONLY fires for streaks) */}
      <Celebration
        trigger={showCelebration}
        onDone={() => setShowCelebration(false)}
      />
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-stretch xl:px-8 px-4 pt-6 bg-transparent">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold text-gray-800">Daily Routine</span>
            </div>
            <div className="ml-auto flex items-center gap-4">
              {/* Removed Calendar button */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span className="font-bold">{totalPoints} pts</span>
                </div>
              </div>
            </div>
          </div>

          {getMissedTasksCount() > 0 && (
            <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-800 font-medium">
                    You have {getMissedTasksCount()} missed tasks. Let me help you recalibrate!
                  </span>
                </div>
                <button 
                  onClick={recalibrateRoutine}
                  className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Recalibrate Now
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
                <div className="flex gap-2">
                  {/* REMOVE Urgent Task and Add Task buttons; leave only Add Task */}
                  <button 
                    onClick={() => setIsAddTaskOpen(true)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Task
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {routineItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      item.status === 'completed' ? 'bg-green-50 border-green-200' :
                      item.status === 'current' ? 'bg-blue-50 border-blue-200' :
                      item.status === 'in-progress' ? 'bg-purple-50 border-purple-200' :
                      item.status === 'missed' ? 'bg-red-50 border-red-200' :
                      'bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => handleTaskClick(item)}
                  >
                    <div className="flex-shrink-0">
                      {item.status === 'in-progress' ? (
                        <Play className="h-5 w-5 text-purple-600 animate-pulse" />
                      ) : (
                        <CheckCircle className={`h-5 w-5 ${
                          item.status === 'completed' ? 'text-green-600' :
                          item.status === 'current' ? 'text-blue-600' :
                          item.status === 'missed' ? 'text-red-600' :
                          'text-gray-400'
                        }`} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className={`font-medium ${
                        item.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {item.task}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                        <span>{item.time}</span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          {item.duration ? `${item.duration}min` : 'No duration'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.priority === 'high' ? 'bg-red-100 text-red-700' :
                          item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {item.priority}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {item.points} pts
                        </span>
                        {item.streak > 0 && (
                          <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {item.streak} day streak
                          </span>
                        )}
                        {item.flexible && (
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                            Flexible
                          </span>
                        )}
                        {item.compressible && (
                          <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                            Compressible
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {item.status === 'current' && (
                      <div className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full animate-pulse">
                        Time to start!
                      </div>
                    )}
                    {item.status === 'in-progress' && (
                      <div className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                        In Progress
                      </div>
                    )}
                    {item.status === 'missed' && (
                      <div className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                        Missed
                      </div>
                    )}
                    {item.quality && (
                      <div className="flex items-center gap-1">
                        {[...Array(item.quality)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <ReminderSystem 
        routineItems={routineItems}
        onUpdateTask={updateTask}
      />

      <AddTaskDialog 
        isOpen={isAddTaskOpen} 
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={addTask}
      />

      {/* UrgentTaskDialog and RoutineCalendar REMOVED */}

      <RecalibrateDialog
        isOpen={isRecalibrateOpen}
        onClose={() => setIsRecalibrateOpen(false)}
        missedTasks={routineItems.filter(item => item.status === 'missed')}
        upcomingTasks={routineItems.filter(item => item.status === 'upcoming')}
      />

      {/* RoutineCalendar REMOVED */}
      {/* {isCalendarOpen && */}
      {/*   <RoutineCalendar ... /> */}
      {/* } */}

      {selectedTask && isTaskTrackerOpen && (
        <TaskTracker
          task={selectedTask}
          isOpen={isTaskTrackerOpen}
          onClose={() => {
            setIsTaskTrackerOpen(false);
            setSelectedTask(null);
          }}
          onComplete={handleTaskComplete}
          onStart={handleTaskStart}
        />
      )}

      {streakReward && (
        <StreakRewards
          isOpen={isStreakRewardOpen}
          onClose={() => {
            setIsStreakRewardOpen(false);
            setStreakReward(null);
          }}
          reward={streakReward}
          onClaim={() => {
            setShowCelebration(true); // celebration on reward claim
            toast({
              title: "Reward Claimed! 🎉",
              description: `You earned ${streakReward.bonusPoints} bonus points!`,
            });
            setIsStreakRewardOpen(false);
            setStreakReward(null);
          }}
        />
      )}
    </SidebarProvider>
  );
};

export default Routine;
