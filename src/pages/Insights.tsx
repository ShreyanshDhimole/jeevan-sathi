
import React, { useMemo } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TrendingUp, BarChart3, Calendar, Clock, Shield, Smartphone } from "lucide-react";
import { useLocation } from "react-router-dom";

// Placeholder: In real app, import these hooks/data from context/store
// Assume Tasks/Goals/Points/Streaks data is pulled from localStorage or global state
const useTaskStats = () => {
  // Placeholder: Use real state or context
  const tasksData = JSON.parse(localStorage.getItem("tasks") || "[]");
  const completed = tasksData.filter((t: any) => t.completed).length;
  const total = tasksData.length;
  const weekly = Array(7).fill(0); // fill with per-day completed counts
  const today = new Date().getDay();
  // Fake weekly completed count: Just split completed randomly for example/demo
  for (let i = 0; i < completed; i++) {
    weekly[Math.floor(Math.random() * 7)] += 1;
  }
  return {
    completed,
    total,
    weekly, // array, Mon=0...Sun=6
  };
};
const useGoalStats = () => {
  // Placeholder: Use real state or context
  const goalsData = JSON.parse(localStorage.getItem("goals") || "[]");
  return {
    achieved: goalsData.length, // not filtering by finished, adjust as per your schema
  };
};
const usePoints = () => {
  // Placeholder: Use real state or context
  return JSON.parse(localStorage.getItem("points") || "0");
};
const useStreaks = () => {
  // Placeholder logic for current/best streak, fill in from real routines as needed
  // For now, hardcoded values as placeholder
  return {
    current: 5,
    best: 12,
    weekly: 2,
  };
};
const useProductiveTime = () => {
  // Placeholder to return "most productive" time-block
  // In real app, aggregate task completion timestamps.
  return "9:00 AM - 11:00 AM";
};
const useAvgTaskCompletion = (stats: {completed: number, total: number}) => {
  if (!stats.total) return 0;
  return Math.round((stats.completed / stats.total) * 100);
};
/**
 * For screen time and app usage, only possible in native; here, placeholder data or permission request
 */
import { ScreenTimePermission } from "@/components/insights/ScreenTimePermission";

const Insights = () => {
  const location = useLocation(); // For possible detailed analytics later
  // Main stat hooks
  const taskStats = useTaskStats();
  const goalStats = useGoalStats();
  const points = usePoints();
  const streaks = useStreaks();
  const productiveTime = useProductiveTime();
  const avgTaskCompletion = useAvgTaskCompletion(taskStats);

  // Demo weekly performance data, fill real data in implementation
  // Assume Mon-Sun order
  const weeklyPerf = [
    { day: "Mon", value: taskStats.weekly[0] },
    { day: "Tue", value: taskStats.weekly[1] },
    { day: "Wed", value: taskStats.weekly[2] },
    { day: "Thu", value: taskStats.weekly[3] },
    { day: "Fri", value: taskStats.weekly[4] },
    { day: "Sat", value: taskStats.weekly[5] },
    { day: "Sun", value: taskStats.weekly[6] },
  ];
  // Total hours worked is not tracked unless you have timer data; using goals as fallback
  const totalHoursWorked = useMemo(() => {
    // If timerState in goals, aggregate total time for all finished goals, placeholder here
    // In real app, loop over all goals and sum their timerState.currentTime where appropriate
    return "5h 30m"; // placeholder until timer integration
  }, []);

  // Placeholder most used apps and screen time graph (needs mobile+plugin)
  const mostUsedApps = [
    { name: "YouTube", time: "4h 10m" },
    { name: "WhatsApp", time: "2h 35m" },
    { name: "Chrome", time: "1h 30m" },
  ];
  const screenTimeData = [
    { day: "Mon", value: 2.2 },
    { day: "Tue", value: 3.5 },
    { day: "Wed", value: 4.0 },
    { day: "Thu", value: 3.2 },
    { day: "Fri", value: 4.8 },
    { day: "Sat", value: 3.3 },
    { day: "Sun", value: 3.1 },
  ];
  // For showing permission screen vs. data, you may add logic to detect mobile/web in future

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-stretch xl:px-8 px-4 pt-6 bg-transparent">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span className="text-lg font-semibold text-gray-800">Insights</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weekly Performance */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Weekly Performance</h3>
              </div>
              <div className="space-y-3">
                {weeklyPerf.map(({ day, value }) => (
                  <div key={day} className="flex items-center gap-3">
                    <span className="w-8 text-sm font-medium text-gray-600">{day}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${Math.min(value * 10, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Time Insights */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Time Insights</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Most productive time</span>
                  <span className="font-bold text-green-600">{productiveTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average task completion</span>
                  <span className="font-bold text-blue-600">{avgTaskCompletion}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current streak</span>
                  <span className="font-bold text-purple-600">{streaks.current} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Best streak</span>
                  <span className="font-bold text-yellow-600">{streaks.best} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Weekly streak</span>
                  <span className="font-bold text-red-600">{streaks.weekly} weeks</span>
                </div>
              </div>
            </div>
            {/* Monthly Overview */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Monthly Overview</h3>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{taskStats.completed}</div>
                  <div className="text-sm text-gray-600">Tasks Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{goalStats.achieved}</div>
                  <div className="text-sm text-gray-600">Goals Achieved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{points || 0}</div>
                  <div className="text-sm text-gray-600">Points Earned</div>
                </div>
              </div>
            </div>
            {/* Screen Time Insights */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="h-6 w-6 text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">Screen Time & App Usage</h3>
              </div>
              {/* Permissions / Data Placeholder */}
              <ScreenTimePermission />
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="font-semibold text-gray-700 mb-2">3 Most Used Apps (this week)</div>
                  <ul>
                    {mostUsedApps.map((app, i) => (
                      <li key={app.name} className="flex justify-between items-center py-1">
                        <span>{i + 1}. {app.name}</span>
                        <span className="text-gray-600">{app.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 mb-2">Total Hours Worked (this week)</div>
                  <div className="text-2xl font-bold text-blue-600">{totalHoursWorked}</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 mb-2">Screen Time (hrs, last 7 days)</div>
                  {/* Replace this with a chart component if you add real chart data */}
                  <ul>
                    {screenTimeData.map((d) => (
                      <li key={d.day} className="flex justify-between py-0.5">
                        <span>{d.day}</span>
                        <span>{d.value}h</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-400">
                <span className="flex items-center gap-1"><Shield strokeWidth={1.5} className="h-4 w-4" /> To access detailed device usage, please grant app usage and accessibility permissions in the mobile app version.
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Insights;
