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

const Index = () => {
  // --- Routine data (Minimal, to demo dynamic) ---
  // In real app pull from context/hook/store for routine data:
  const [routineItems] = useState([
    {
      id: '1',
      time: "6:00 AM",
      task: "Naam Jaap",
      status: "completed" as const, // Only status: "completed" in stub
      priority: "high" as const,
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
  ]);
  // --- End routine data ---

  // Task state (simulate persistent, replace with central store if exists)
  const [tasks, setTasks] = useState([
    { id: '1', task: "Complete project proposal", priority: "high", completed: false, starred: false },
    { id: '2', task: "Call insurance company", priority: "medium", completed: true, starred: false },
    { id: '3', task: "Buy groceries", priority: "low", completed: false, starred: true },
    { id: '4', task: "Schedule dentist appointment", priority: "medium", completed: false, starred: false },
    { id: '5', task: "Review team feedback", priority: "high", completed: true, starred: true },
  ]);
  // For real app, this could come from context, or a query/hook.
  // --- End tasks state ---

  // Reminders stub, replace with data fetching from reminders/notes context/hook
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
  // --- End reminders stub ---

  // Day start (wake up logic)
  const [dayStarted, wakeUpTime, startDay] = useDayStart();

  // Goals - dynamic live from hook
  const {
    goals,
  } = useGoals();

  // Derived dashboard data from modules:
  // 1. Routine summary calculation (stubbed - replace with dynamic)
  // Find total + completed. Show current/next.
  const routineTotal = routineItems.length;
  const routineCompleted = routineItems.filter((r) => r.status === 'completed').length;
  // As routineItems doesn't have current/upcoming in stub, these will always be undefined
  const current = routineItems.find((r) => r.status === 'current');
  const next = routineItems.find((r) => r.status === 'upcoming');
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

  // Dialog states
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-stretch xl:px-8 px-4 pt-6 bg-transparent">
          {/* Start-the-day overlay */}
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
                Let's Start the Day
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
            {/* Calendar & Urgent Task Buttons */}
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
          
          <RoutineBanner wakeUpTime={wakeUpTime} />
          {/* Pass ALL dynamic data */}
          <DashboardTiles 
            routine={routineSummary}
            tasks={taskSummary}
            goal={goalSummary}
            rewards={rewardsSummary}
            reminders={remindersDashboard}
            weekly={weeklyStats}
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
