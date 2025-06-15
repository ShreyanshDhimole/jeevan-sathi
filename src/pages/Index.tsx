
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardTiles } from "@/components/DashboardTiles";
import { RoutineBanner } from "@/components/RoutineBanner";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-stretch xl:px-16 px-2 pt-8 bg-background">
          <SidebarTrigger />
          <header className="mb-6">
            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight flex items-center gap-4">
              Jeevan Sathi <span className="text-xl text-muted-foreground font-light">– Your Intelligent Daily Companion</span>
            </h1>
            <div className="mt-3 text-base xl:text-lg text-muted-foreground">
              Master your day with adaptive routines, smart reminders, and motivational rewards.
            </div>
          </header>
          <RoutineBanner />
          <DashboardTiles />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
