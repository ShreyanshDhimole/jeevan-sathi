
import { useState, useEffect } from "react";
import { useGoals } from "@/hooks/useGoals";
import { ReminderNoteItem } from "@/types/reminders";
import { useDayStart } from "@/hooks/useDayStart";
import { RoutineItem } from "@/types/routine";
import { useTasks } from "@/hooks/useTasks";
import { getPoints, subscribeToPointsChange } from "@/utils/pointsStorage";
import { countSubGoals } from "@/utils/goalProgress";
import { formatTime } from "@/utils/formatTime";
import { getCompletionCountsByDay } from "@/utils/getCompletionCountsByDay";

const ROUTINE_STORAGE_KEY = "user_routine";
const REMINDER_STORAGE_KEY = "reminders_notes";

export function useDashboardData() {
  // Routine Items
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);
  useEffect(() => {
    const loadRoutine = () => {
      const stored = localStorage.getItem(ROUTINE_STORAGE_KEY);
      if (stored) {
        try {
          setRoutineItems(JSON.parse(stored));
        } catch {
          setRoutineItems([]);
        }
      } else {
        setRoutineItems([]);
      }
    };
    loadRoutine();
    window.addEventListener('storage', loadRoutine);
    const interval = setInterval(loadRoutine, 2000);
    return () => {
      window.removeEventListener('storage', loadRoutine);
      clearInterval(interval);
    };
  }, []);

  // Tasks with completedAt patch
  const { tasks } = useTasks();
  useEffect(() => {
    const updatedTasks = tasks.map(t =>
      t.completed && !t.completedAt
        ? { ...t, completedAt: new Date().toISOString() }
        : t
    );
    if (updatedTasks.some((t, i) => tasks[i] !== t)) {
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
  }, [tasks]);

  useEffect(() => {
    const updatedRoutines = routineItems.map(r =>
      r.status === "completed" && !r.completedAt
        ? { ...r, completedAt: new Date().toISOString() }
        : r
    );
    if (updatedRoutines.some((r, i) => routineItems[i] !== r)) {
      localStorage.setItem(ROUTINE_STORAGE_KEY, JSON.stringify(updatedRoutines));
    }
  }, [routineItems]);

  // Reminders
  const [reminders, setReminders] = useState<ReminderNoteItem[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem(REMINDER_STORAGE_KEY);
    if (stored) {
      try {
        setReminders(JSON.parse(stored));
      } catch {
        setReminders([]);
      }
    } else {
      setReminders([]);
    }
  }, []);
  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem(REMINDER_STORAGE_KEY);
      if (stored) {
        try {
          setReminders(JSON.parse(stored));
        } catch {
          setReminders([]);
        }
      } else {
        setReminders([]);
      }
    };
    window.addEventListener('storage', handler);
    const interval = setInterval(handler, 2000);
    return () => {
      window.removeEventListener('storage', handler);
      clearInterval(interval);
    };
  }, []);

  // Day start (wake up logic)
  const [dayStarted, wakeUpTime, startDay] = useDayStart();

  // Goals
  const { goals } = useGoals();

  // Points
  const [points, setPointsState] = useState(0);
  useEffect(() => {
    setPointsState(getPoints());
    const unsubscribe = subscribeToPointsChange(setPointsState);
    return () => unsubscribe();
  }, []);

  // Derived summaries:
  const routineTotal = routineItems.length;
  const routineCompleted = routineItems.filter((r) => r.status === 'completed').length;
  const current = routineItems.find((r) => r.status === "current");
  const next = routineItems.find((r) => r.status === "upcoming");

  const routineSummary = {
    completed: routineCompleted,
    total: routineTotal,
    currentTask: current?.task ?? "",
    nextTask: next?.task ?? "",
    nextTime: next?.time ?? "",
    progressRatio: `${routineCompleted === 0 ? 0 : Math.min((routineCompleted / routineTotal) * 100,100)}%`,
  };

  const quickTasks = tasks.filter((t) => !t.completed).map((t) => ({ id: t.id, name: t.task }));
  const taskSummary = {
    left: quickTasks.length,
    items: quickTasks,
  };

  const firstGoal = goals[0];
  let completedDays = 0;
  let totalDays = 0;
  let totalTimeSpent = 0;
  let incompleteItems = 0;
  if (firstGoal) {
    const { total, completed } = countSubGoals(firstGoal.subGoals ?? []);
    completedDays = completed;
    totalDays = total;
    totalTimeSpent = firstGoal.timerState?.currentTime || 0;
    function countIncomplete(subGoals: any[]) {
      return subGoals.reduce(
        (acc, sg) => {
          const inner = countIncomplete(sg.subGoals ?? []);
          return acc + (sg.isCompleted ? 0 : 1) + inner;
        },
        0
      );
    }
    incompleteItems = countIncomplete(firstGoal.subGoals ?? []);
  }
  const percentDone = totalDays === 0 ? 0 : Math.floor((completedDays / totalDays) * 100);
  const goalSummary = {
    name: firstGoal?.title ?? "",
    percent: percentDone,
    totalTimeSpent: formatTime(totalTimeSpent),
    incompleteItems,
  };

  const rewardsSummary = {
    totalPoints: points,
    streak: 7,
    nextRewardAt: 1500,
    lastPoints: 15,
  };
  const pointsSummary = {
    totalPoints: points,
    lastPoints: rewardsSummary.lastPoints,
    streak: rewardsSummary.streak,
    nextRewardAt: rewardsSummary.nextRewardAt,
  };

  const remindersDashboard = reminders
    .filter((r) => r.type === "reminder")
    .slice(0,5)
    .map((r) => ({
      id: r.id,
      label: r.title,
      time: r.time || (r.date ? new Date(r.date as string).toLocaleDateString() : ""),
    }));

  // --- Weekly progress: live ---
  const weeklyCounts = getCompletionCountsByDay({
    tasks,
    routines: routineItems,
  });
  const maxCount = Math.max(1, ...weeklyCounts);
  const weeklyBars = weeklyCounts.map(n => Math.round((n / maxCount) * 95 + 5));
  const totalThisWeek = weeklyCounts.reduce((a, b) => a + b, 0);
  const weeklyStats = {
    percent: totalThisWeek,
    bars: weeklyBars,
    improving: weeklyCounts[6] >= weeklyCounts[5],
  };

  // DashboardTile config
  const dashboardConfig = [
    {
      key: "routine",
      title: "Today's Routine",
      icon: "Clock",
      bgClass: "from-blue-500 via-blue-600 to-indigo-700",
      getData: () => ({
        completed: routineSummary.completed,
        total: routineSummary.total,
        currentLabel: "Current",
        mainText: routineSummary.currentTask ?? "-",
        nextLabel: "Next",
        nextText: routineSummary.nextTask
          ? `${routineSummary.nextTask} (${routineSummary.nextTime})`
          : "—",
        progress: routineSummary.progressRatio,
        statusText: `${routineSummary.completed}/${routineSummary.total} Done`,
      }),
    },
    {
      key: "tasks",
      title: "Quick Tasks",
      icon: "CheckCircle2",
      bgClass: "from-emerald-500 via-green-600 to-teal-700",
      getData: () => ({
        left: taskSummary.left,
        statusText: `${taskSummary.left} Left`,
        preview: taskSummary.items.slice(0, 2),
      }),
    },
    {
      key: "goal",
      title: firstGoal?.title || "Goal Progress",
      icon: "Target",
      bgClass: "from-purple-500 via-violet-600 to-purple-700",
      getData: () => ({
        percent: goalSummary.percent,
        statusText: `${goalSummary.percent}%`,
        totalTimeSpent: goalSummary.totalTimeSpent,
        incompleteItems: goalSummary.incompleteItems,
      }),
    },
    {
      key: "rewards",
      title: "Points & Rewards",
      icon: "Star",
      bgClass: "from-orange-500 via-amber-600 to-yellow-600",
      getData: () => ({
        lastPoints: rewardsSummary.lastPoints,
        totalPoints: rewardsSummary.totalPoints,
        streak: rewardsSummary.streak,
        nextRewardAt: rewardsSummary.nextRewardAt,
        progress: `${Math.min(
          (rewardsSummary.totalPoints / rewardsSummary.nextRewardAt) * 100,
          100
        )}%`,
        statusText: `+${rewardsSummary.lastPoints}`,
      }),
    },
    {
      key: "reminders",
      title: "Smart Reminders",
      icon: "Calendar",
      bgClass: "from-pink-500 via-rose-600 to-red-600",
      getData: () => ({
        reminders: remindersDashboard.slice(0, 2),
        statusText: `${remindersDashboard.length} Active`,
      }),
    },
    {
      key: "weekly",
      title: "Weekly Progress",
      icon: "TrendingUp",
      bgClass: "from-cyan-500 via-blue-600 to-indigo-700",
      getData: () => ({
        percent: weeklyStats.percent,
        improving: weeklyStats.improving,
        bars: weeklyStats.bars,
        statusText: `${weeklyStats.percent > 0 ? "+" : ""}${weeklyStats.percent}`,
      }),
    },
  ];

  // Also provide nextRoutine for RoutineBanner
  const nextRoutine = routineItems
    .slice()
    .sort((a, b) => {
      const parseTime = (t: string) => {
        const [time, suffix] = t.split(" ");
        let [h, m] = time.split(':').map(Number);
        if (suffix) {
          if (suffix.toLowerCase() === "pm" && h < 12) h += 12;
          if (suffix.toLowerCase() === "am" && h === 12) h = 0;
        }
        return h * 60 + m;
      };
      return parseTime(a.time) - parseTime(b.time);
    })[0];

  return {
    routineItems,
    reminders,
    routineSummary,
    taskSummary,
    goalSummary,
    rewardsSummary,
    pointsSummary,
    remindersDashboard,
    weeklyStats,
    dashboardConfig,
    dayStarted,
    wakeUpTime,
    startDay,
    points,
    nextRoutine,
  };
}
