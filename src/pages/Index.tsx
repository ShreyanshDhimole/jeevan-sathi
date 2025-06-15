
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardTiles } from "@/components/DashboardTiles";
import { RoutineBanner } from "@/components/RoutineBanner";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-stretch xl:px-8 px-4 pt-6 bg-transparent">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live updates active</span>
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
          
          <RoutineBanner />
          <DashboardTiles />
          
          <div className="mt-8 text-center text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
