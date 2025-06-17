import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { RoutineItem, CompletionRecord, StreakReward } from "@/types/routine";
import { recalibrateWithUrgentTask } from "@/utils/recalibrationLogic";
import { useTasks } from "@/hooks/useTasks";
import { getPoints, setPoints, subscribeToPointsChange } from "@/utils/pointsStorage";

const ROUTINE_STORAGE_KEY = "user_routine";

export function useRoutine() {
  const { tasks } = useTasks();
  const { toast } = useToast();

  // --- Routine item state ---
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);
  // POINTS: Use shared points state
  const [totalPoints, setTotalPoints] = useState<number>(0);

  // --- Dialogs and UI state ---
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isRecalibrateOpen, setIsRecalibrateOpen] = useState(false);
  const [isTaskTrackerOpen, setIsTaskTrackerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<RoutineItem | null>(null);
  const [streakReward, setStreakReward] = useState<StreakReward | null>(null);
  const [isStreakRewardOpen, setIsStreakRewardOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // --- Load from localStorage on mount ---
  useEffect(() => {
    const stored = localStorage.getItem(ROUTINE_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Only set if we actually have data, don't fall back to defaults
        if (parsed && parsed.length > 0) {
          setRoutineItems(parsed);
        }
      } catch {
        // Don't set defaults on parse error, just start fresh
        setRoutineItems([]);
      }
    }
    // Load shared points
    setTotalPoints(getPoints());
    // Subscribe points with cross-tab sync
    const unsubscribePoints = subscribeToPointsChange(setTotalPoints);
    return () => {
      unsubscribePoints();
    };
  }, []);

  // Listen for 'storage' events and also poll every 2 seconds, to sync across tabs and dashboard.
  useEffect(() => {
    function syncRoutineFromStorage() {
      try {
        const stored = localStorage.getItem(ROUTINE_STORAGE_KEY);
        if (stored) {
          const parsed: RoutineItem[] = JSON.parse(stored);
          if (
            parsed.length !== routineItems.length ||
            parsed.some((item, idx) => item.id !== routineItems[idx]?.id)
          ) {
            setRoutineItems(parsed);
            console.log("[syncRoutineFromStorage] Loaded from localStorage:", parsed);
          }
        }
      } catch (e) {}
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === ROUTINE_STORAGE_KEY) {
        syncRoutineFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);
    const interval = setInterval(syncRoutineFromStorage, 2000);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [routineItems]);

  // Keep routineItems in sync with localStorage & log
  useEffect(() => {
    if (routineItems.length > 0) {
      localStorage.setItem(ROUTINE_STORAGE_KEY, JSON.stringify(routineItems));
      console.log("[setRoutineItems] Saved to localStorage:", routineItems);
    }
  }, [routineItems]);

  // --- Utility functions ---
  const convertTimeToMinutes = (time: string) => {
    const [timeStr, period] = time.split(' ');
    const [hour, minute] = timeStr.split(':').map(Number);
    const hour24 = period === 'PM' && hour !== 12 ? hour + 12 : (period === 'AM' && hour === 12 ? 0 : hour);
    return hour24 * 60 + minute;
  };

  // --- Derived and utility values ---
  const getDisplayRoutineItems = () => (
    [...routineItems].sort(
      (a, b) => convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time)
    )
  );

  const getUnifiedRoutineItems = () => {
    const taskTabItems = tasks
      .filter((t) => !routineItems.some((r) => r.task === t.task))
      .map((t) => {
        const routineTask: RoutineItem = {
          id: "tasktab-" + t.id,
          time: t.preferredTime ?? "6:00 PM",
          task: t.task,
          status: t.completed
            ? "completed"
            : "upcoming",
          priority: t.priority,
          flexible: t.flexible ?? true,
          points: t.points ?? 25,
          streak: 0,
          completionHistory: [],
          duration: t.duration ?? 30,
          compressible: t.flexible ?? true,
          minDuration: t.duration
            ? Math.max(15, Math.floor(t.duration * 0.5))
            : 15,
        };
        return routineTask;
      });
    return [...routineItems, ...taskTabItems].sort(
      (a, b) => convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time)
    );
  };

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

  // Only update routineItems array for status, not add or remove.
  const triggerAutoRecalibration = () => {
    const now = new Date();
    setRoutineItems(prev =>
      prev.map(item => {
        const [time, period] = item.time.split(' ');
        const [hour, minute] = time.split(':').map(Number);
        const itemHour = period === 'PM' && hour !== 12 ? hour + 12 : (period === 'AM' && hour === 12 ? 0 : hour);
        const itemTime = itemHour * 60 + minute;
        const nowTime = now.getHours() * 60 + now.getMinutes();
        if (item.status === 'upcoming' && nowTime > itemTime + 30) {
          return { ...item, status: 'missed' as const };
        }
        if (item.status === 'upcoming' && nowTime >= itemTime - 15 && nowTime <= itemTime + 15) {
          return { ...item, status: 'current' as const };
        }
        return item;
      })
    );
  };

  // --- Handlers ---
  const addTask = (newTask: {
    task: string;
    priority: 'high' | 'medium' | 'low';
    preferredTime: string;
    flexible: boolean;
    points: number;
    duration: number;
  }) => {
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
      duration: newTask.duration ?? 30,
      compressible: newTask.flexible,
      minDuration: Math.max(15, Math.floor(newTask.duration * 0.5)),
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

  const handleTaskStart = (taskId: string) => {
    setRoutineItems(prev => prev.map(item =>
      item.id === taskId
        ? { ...item, status: 'in-progress' as const, startedAt: new Date().toISOString() }
        : item
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
    if (newStreak === 7 || newStreak === 14 || newStreak === 30 || newStreak % 30 === 0) {
      const reward = getStreakReward(newStreak);
      setStreakReward(reward);
      setIsStreakRewardOpen(true);
      // AWARD POINTS: Use shared logic!
      setPoints(totalPoints + task.points + reward.bonusPoints);
      setShowCelebration(true);
    } else {
      setPoints(totalPoints + task.points);
    }
    setRoutineItems(prev =>
      prev.map(item =>
        item.id === taskId
          ? {
              ...item,
              status: 'completed' as const,
              streak: newStreak,
              quality,
              lastCompleted: new Date().toISOString(),
              completionHistory: [...item.completionHistory, completionRecord],
              startedAt: undefined
            }
          : item
      )
    );
  };

  const handleTaskClick = (task: RoutineItem) => {
    // Open TaskTracker for any incomplete task
    if (task.status !== 'completed' && task.status !== 'missed') {
      setSelectedTask(task);
      setIsTaskTrackerOpen(true);
    }
  };

  const updateTask = (taskId: string, updates: Partial<RoutineItem>) => {
    setRoutineItems(prev =>
      prev.map(item =>
        item.id === taskId ? { ...item, ...updates } : item
      )
    );
  };

  const deleteRoutineItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this routine item? This action cannot be undone.")) {
      setRoutineItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Task Deleted",
        description: "The task was successfully deleted from your routine.",
        variant: "destructive"
      });
    }
  };

  const getMissedTasksCount = () => routineItems.filter(item => item.status === 'missed').length;

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

  // --- Misc handlers for UI/UX ---
  const closeTaskTracker = () => {
    setIsTaskTrackerOpen(false);
    setSelectedTask(null);
  };

  const closeStreakReward = () => {
    setIsStreakRewardOpen(false);
    setStreakReward(null);
  };

  // --- API ---
  return {
    routineItems,
    setRoutineItems,
    displayRoutineItems: getDisplayRoutineItems(),
    addTask,
    deleteRoutineItem,
    isAddTaskOpen,
    setIsAddTaskOpen,
    isRecalibrateOpen,
    setIsRecalibrateOpen,
    isTaskTrackerOpen,
    setIsTaskTrackerOpen,
    selectedTask,
    setSelectedTask,
    isStreakRewardOpen,
    setIsStreakRewardOpen,
    streakReward,
    setStreakReward,
    handleTaskClick,
    handleTaskStart,
    handleTaskComplete,
    updateTask,
    totalPoints,
    getMissedTasksCount,
    closeTaskTracker,
    closeStreakReward,
    showCelebration,
    setShowCelebration,
    triggerAutoRecalibration,
    updateRoutineStatus,
  };
}
