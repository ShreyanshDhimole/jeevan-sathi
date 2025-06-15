
import React from "react";

export const DashboardHeader = () => (
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
);
