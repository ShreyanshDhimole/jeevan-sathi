import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardTiles } from "@/components/DashboardTiles";
import { RoutineBanner } from "@/components/RoutineBanner";
import { RoutineCalendar } from "@/components/RoutineCalendar";
import { UrgentTaskDialog } from "@/components/UrgentTaskDialog";
import { Calendar, Zap } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { ReminderNoteItem } from '@/types/reminders';
import { useDayStart } from "@/hooks/useDayStart";
import { RoutineItem } from "@/types/routine";
import { useTasks } from "@/hooks/useTasks";
import { PointsButton } from "@/components/PointsButton";
import { getPoints, setPoints, subscribeToPointsChange } from "@/utils/pointsStorage";

// --- Routine data (Minimal, to demo dynamic) ---
const ROUTINE_STORAGE_KEY = "user_routine";
const REMINDER_STORAGE_KEY = "reminders_notes";

const Index = () => {
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);

  // Load routine from localStorage and listen to changes
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
    // fallback interval for local routines from same tab
    const interval = setInterval(loadRoutine, 2000); 
    return () => {
      window.removeEventListener('storage', loadRoutine);
      clearInterval(interval);
    };
  }, []);

  // Replace separate local tasks state with useTasks hook
  const { tasks } = useTasks();

  // Reminders: sync with the reminders_notes localStorage key
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

  // Listen for localStorage changes from other tabs/windows and also whenever dashboard is re-rendered
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
    const interval = setInterval(handler, 2000); // fallback: check every 2s
    return () => {
      window.removeEventListener('storage', handler);
      clearInterval(interval);
    };
  }, []);

  // Day start (wake up logic)
  const [dayStarted, wakeUpTime, startDay] = useDayStart();

  // Goals - dynamic live from hook
  const { goals } = useGoals();

  // At top of component:
  const [points, setPointsState] = React.useState(0);

  React.useEffect(() => {
    setPointsState(getPoints());
    const unsubscribe = subscribeToPointsChange(setPointsState);
    return () => unsubscribe();
  }, []);

  // Derived dashboard data from modules:
  const routineTotal = routineItems.length;
  const routineCompleted = routineItems.filter((r) => r.status === 'completed').length;

  // Use correct type: filter for "current" not from a "completed" static value
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

  // 2. Tasks summary
  const quickTasks = tasks.filter((t) => !t.completed).map((t) => ({ id: t.id, name: t.task }));
  const taskSummary = {
    left: quickTasks.length,
    items: quickTasks,
  };

  // 3. Goal summary (first goal, fallback blank)
  const firstGoal = goals[0];
  const completedDays = firstGoal?.subGoals.filter((sg) => sg.isCompleted).length ?? 0;
  const totalDays = firstGoal?.subGoals.length ?? 0;
  const percentDone = totalDays === 0 ? 0 : Math.floor((completedDays / totalDays) * 100);
  const goalSummary = {
    name: firstGoal?.title ?? "",
    percent: percentDone,
    completedDays,
    totalDays,
    daysLeft: totalDays - completedDays,
  };

  // 4. Rewards - demo via points calculated from tasks/goals etc
  // In rewardsSummary and pointsSummary use points instead of local calc:
  const rewardsSummary = {
    totalPoints: points,
    streak: 7,
    nextRewardAt: 1500,
    lastPoints: 15,
  };

  // --- Points summary for the Points dashboard tab ---
  // ...and so on...
  const pointsSummary = {
    totalPoints: points,
    lastPoints: rewardsSummary.lastPoints,
    streak: rewardsSummary.streak,
    nextRewardAt: rewardsSummary.nextRewardAt,
  };

  // 5. Reminders - mapped into Dashboard format
  const remindersDashboard = reminders
    .filter((r) => r.type === "reminder") // Only reminders, not notes
    .slice(0,5)
    .map((r) => ({
      id: r.id,
      label: r.title,
      time: r.time || (r.date ? new Date(r.date as string).toLocaleDateString() : ""),
    }));

  // 6. Weekly - demo, calculate percent change from previous
  const weeklyStats = {
    percent: 12,
    bars: [40, 60, 45, 80, 65, 90, 75],
    improving: true,
  };

  // NEW: DashboardTile config (titles, ordering, labels, icon, color class, etc)
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
        completedDays: goalSummary.completedDays,
        totalDays: goalSummary.totalDays,
        daysLeft: goalSummary.daysLeft,
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
        statusText: weeklyStats.percent > 0 ? `+${weeklyStats.percent}%` : "0%",
      }),
    },
  ];

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isUrgentTaskOpen, setIsUrgentTaskOpen] = useState(false);

  const handleUrgentTask = (taskDescription: string, duration: number) => {
    console.log('Urgent task:', taskDescription, duration);
  };

  // Fullscreen overlay if day not started yet AND after 2 AM
  const [showOverlay, setShowOverlay] = useState(false);
  useEffect(() => {
    const now = new Date();
    setShowOverlay(!dayStarted && now.getHours() >= 2);
  }, [dayStarted]);

  // For the RoutineBanner, pass today's first routine as "suggested", and main logic for lateness
  // The RoutineBanner will now use these dynamic routineItems
  const nextRoutine = routineItems
    .slice()
    .sort((a, b) => {
      const parseTime = (t: string) => {
        // '6:00 AM' or '18:00'
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-stretch xl:px-8 px-4 pt-6 bg-transparent">
          {showOverlay && (
            <div className="fixed inset-0 z-50 bg-white/90 flex flex-col items-center justify-center">
              <div className="mb-8 text-3xl font-bold text-blue-700 animate-fade-in">Good Morning!</div>
              <button
                className="px-8 py-4 bg-purple-600 text-white rounded-2xl text-xl font-semibold shadow-lg hover:bg-purple-700 transition hover-scale"
                onClick={() => {
                  startDay();
                  setShowOverlay(false);
                }}
              >
                {"Let's Start the Day"}
              </button>
              <div className="mt-3 text-gray-400 text-sm">Press to calibrate your routine for today</div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live updates active</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button 
                onClick={() => setIsCalendarOpen(true)}
                className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors shadow-sm"
              >
                <Calendar className="h-4 w-4" />
                Calendar
              </button>
              <button 
                onClick={() => setIsUrgentTaskOpen(true)}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
              >
                <Zap className="h-4 w-4" />
                Urgent Task
              </button>
            </div>
          </div>
          
          {/* Show points as simple black text below action buttons */}
          <div className="flex justify-end mb-2">
            <span className="text-base font-semibold text-black mr-6">
              Points: {pointsSummary.totalPoints}
            </span>
          </div>

          <header className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl xl:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                Jeevan Sathi
              </h1>
              <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-medium rounded-full border border-blue-200/50">
                AI Powered
              </div>
            </div>
            <div className="text-lg xl:text-xl text-gray-600 font-medium mb-2">
              Your Intelligent Daily Companion 🚀
            </div>
            <div className="text-base text-gray-500 max-w-2xl">
              Master your day with adaptive routines, smart reminders, and motivational rewards.
            </div>
          </header>
          
          <RoutineBanner
            wakeUpTime={wakeUpTime}
            routineItems={routineItems}
            suggestedRoutine={nextRoutine}
          />
          <DashboardTiles
            dashboardConfig={dashboardConfig}
          />
          
          <div className="mt-8 text-center text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </main>
      </div>
      <RoutineCalendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        routineItems={routineItems}
      />
      <UrgentTaskDialog
        isOpen={isUrgentTaskOpen}
        onClose={() => setIsUrgentTaskOpen(false)}
        onAddUrgentTask={handleUrgentTask}
      />
    </SidebarProvider>
  );
};

export default Index;
