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

// --- Routine data (Minimal, to demo dynamic) ---
const DEMO_ROUTINE_ITEMS: RoutineItem[] = [
  {
    id: '1',
    time: "6:00 AM",
    task: "Naam Jaap",
    status: "completed", // Only status: "completed" in stub
    priority: "high",
    flexible: true,
    points: 75,
    streak: 12,
    quality: 5,
    completionHistory: [
      {
        date: new Date().toISOString(),
        quality: 5,
        duration: 30,
        notes: "Great focus today, felt very peaceful",
        pointsEarned: 75,
      },
    ],
    lastCompleted: new Date().toISOString(),
    duration: 30,
    compressible: true,
    minDuration: 15,
  },
];
// --- End routine data ---

const Index = () => {
  const [routineItems] = useState<RoutineItem[]>(DEMO_ROUTINE_ITEMS);
  const [tasks, setTasks] = useState([
    { id: '1', task: "Complete project proposal", priority: "high", completed: false, starred: false },
    { id: '2', task: "Call insurance company", priority: "medium", completed: true, starred: false },
    { id: '3', task: "Buy groceries", priority: "low", completed: false, starred: true },
    { id: '4', task: "Schedule dentist appointment", priority: "medium", completed: false, starred: false },
    { id: '5', task: "Review team feedback", priority: "high", completed: true, starred: true },
  ]);
  const [reminders, setReminders] = useState<ReminderNoteItem[]>([
    {
      id: 'r1',
      type: 'reminder',
      title: 'Dadi ki medicine',
      content: '',
      category: 'general-reminders',
      date: new Date().toISOString(),
      time: '18:00',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'r2',
      type: 'reminder',
      title: 'Aadhaar card',
      content: '',
      category: 'general-reminders',
      date: new Date(Date.now() + 86400000).toISOString(),
      time: '',
      createdAt: new Date().toISOString(),
    },
  ]);

  // Day start (wake up logic)
  const [dayStarted, wakeUpTime, startDay] = useDayStart();

  // Goals - dynamic live from hook
  const { goals } = useGoals();

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
  const totalPoints =
    goals.reduce((acc, g) => acc + g.subGoals.filter(sg => sg.isCompleted).length * 10, 0) +
    tasks.filter(t => t.completed).length * 5;
  const rewardsSummary = {
    totalPoints,
    streak: 7, // Fake, add actual streak logic later
    nextRewardAt: 1500,
    lastPoints: 15,
  };

  // 5. Reminders - mapped into Dashboard format
  const remindersDashboard = reminders.slice(0,5).map((r) => ({
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
