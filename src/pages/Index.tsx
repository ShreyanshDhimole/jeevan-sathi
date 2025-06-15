
import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardTiles } from "@/components/DashboardTiles";
import { RoutineBanner } from "@/components/RoutineBanner";
import { RoutineCalendar } from "@/components/RoutineCalendar";
import { UrgentTaskDialog } from "@/components/UrgentTaskDialog";
import { Calendar, Zap } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useDashboardData } from "@/hooks/useDashboardData";

// --- Page logic only, all business logic refactored to hooks ---
const Index = () => {
  // Extract all dashboard logic/data from hook
  const {
    dayStarted,
    wakeUpTime,
    startDay,
    dashboardConfig,
    points,
    routineItems,
    nextRoutine,
  } = useDashboardData();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isUrgentTaskOpen, setIsUrgentTaskOpen] = useState(false);

  const handleUrgentTask = (taskDescription: string, duration: number) => {
    console.log('Urgent task:', taskDescription, duration);
  };

  // Live morning overlay
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
              Points: {points}
            </span>
          </div>

          {/* Dashboard greeting header */}
          <DashboardHeader />

          {/* Routine banner and dashboard tiles with config */}
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
