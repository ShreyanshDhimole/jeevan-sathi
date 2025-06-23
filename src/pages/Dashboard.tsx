
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardTiles } from "@/components/DashboardTiles";
import { RoutineBanner } from "@/components/RoutineBanner";
import { RoutineCalendar } from "@/components/RoutineCalendar";
import { MobilePermissionRequest } from "@/components/MobilePermissionRequest";
import { NotificationSystem } from "@/components/NotificationSystem";
import { PointsButton } from "@/components/PointsButton";
import { useRoutine } from "@/hooks/useRoutine";
import { getPoints } from "@/utils/pointsStorage";

const Dashboard = () => {
  const { routineItems, updateTask } = useRoutine();
  const points = getPoints();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col w-full min-w-0 px-3 md:px-4 xl:px-8 pt-4 md:pt-6 bg-transparent">
          {/* Mobile-optimized header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 md:mb-6 w-full">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <SidebarTrigger />
              <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
              <div className="min-w-0 flex-1">
                <DashboardHeader />
              </div>
            </div>
            <div className="flex-shrink-0">
              <PointsButton points={points} />
            </div>
          </div>

          {/* Permission request for mobile */}
          <div className="mb-4 w-full">
            <MobilePermissionRequest />
          </div>

          {/* Notification System */}
          <NotificationSystem routineItems={routineItems} onUpdateTask={updateTask} />

          {/* Mobile-friendly content layout */}
          <div className="space-y-4 md:space-y-6 w-full min-w-0">
            {/* Routine banner - full width on mobile */}
            <div className="w-full min-w-0">
              <RoutineBanner routineItems={routineItems} />
            </div>

            {/* Dashboard tiles - responsive grid */}
            <div className="w-full min-w-0">
              <DashboardTiles dashboardConfig={{}} />
            </div>

            {/* Calendar - full width on mobile, constrained on desktop */}
            <div className="w-full max-w-4xl min-w-0">
              <RoutineCalendar isOpen={false} onClose={() => {}} routineItems={routineItems} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
