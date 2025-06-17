
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardTiles } from "@/components/DashboardTiles";
import { RoutineBanner } from "@/components/RoutineBanner";
import { RoutineCalendar } from "@/components/RoutineCalendar";
import { MobilePermissionRequest } from "@/components/MobilePermissionRequest";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col px-3 md:px-4 xl:px-8 pt-4 md:pt-6 bg-transparent">
          {/* Mobile-optimized header */}
          <div className="flex items-center gap-4 mb-4 md:mb-6">
            <SidebarTrigger />
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            <DashboardHeader />
          </div>

          {/* Permission request for mobile */}
          <div className="mb-4">
            <MobilePermissionRequest />
          </div>

          {/* Mobile-friendly content layout */}
          <div className="space-y-4 md:space-y-6">
            {/* Routine banner - full width on mobile */}
            <div className="w-full">
              <RoutineBanner />
            </div>

            {/* Dashboard tiles - responsive grid */}
            <div className="w-full">
              <DashboardTiles />
            </div>

            {/* Calendar - full width on mobile, constrained on desktop */}
            <div className="w-full max-w-4xl">
              <RoutineCalendar />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
