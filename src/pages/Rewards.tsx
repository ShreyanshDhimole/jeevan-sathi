
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Gift, Trophy, Star } from "lucide-react";

const Rewards = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col px-3 md:px-4 xl:px-8 pt-4 md:pt-6 bg-transparent">
          {/* Mobile-optimized header */}
          <div className="flex items-center gap-4 mb-4 md:mb-6">
            <SidebarTrigger />
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-gray-800">Rewards</span>
            </div>
          </div>

          {/* Mobile-friendly content */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Available Rewards</h2>
              
              {/* Reward cards - stack on mobile, grid on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="h-6 w-6 text-green-600" />
                    <span className="font-semibold text-green-800">Week Streak</span>
                  </div>
                  <p className="text-sm text-green-700 mb-3">Complete 7 days in a row</p>
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600">+100 pts</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="h-6 w-6 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Perfect Day</span>
                  </div>
                  <p className="text-sm text-yellow-700 mb-3">Complete all tasks in a day</p>
                  <div className="text-right">
                    <span className="text-lg font-bold text-yellow-600">+50 pts</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 md:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Gift className="h-6 w-6 text-blue-600" />
                    <span className="font-semibold text-blue-800">Month Champion</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">30-day streak achievement</p>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-600">+500 pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress section */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Current Streak</span>
                  <span className="text-sm text-gray-600">3 days</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Total Points</span>
                  <span className="text-sm text-gray-600">1,250 pts</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Next Reward</span>
                  <span className="text-sm text-blue-600">Week Streak (4 days to go)</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Rewards;
