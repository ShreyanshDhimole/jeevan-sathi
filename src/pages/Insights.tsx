
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TrendingUp, BarChart3, Calendar, Clock } from "lucide-react";

const Insights = () => {
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
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Weekly Performance</h3>
              </div>
              <div className="space-y-3">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const progress = [85, 92, 78, 88, 95, 67, 73][index];
                  return (
                    <div key={day} className="flex items-center gap-3">
                      <span className="w-8 text-sm font-medium text-gray-600">{day}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-700">{progress}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Time Insights</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Most productive time</span>
                  <span className="font-bold text-green-600">9:00 AM - 11:00 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average task completion</span>
                  <span className="font-bold text-blue-600">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current streak</span>
                  <span className="font-bold text-purple-600">12 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Best category</span>
                  <span className="font-bold text-yellow-600">Personal</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Monthly Overview</h3>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">127</div>
                  <div className="text-sm text-gray-600">Tasks Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">18</div>
                  <div className="text-sm text-gray-600">Goals Achieved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">2,340</div>
                  <div className="text-sm text-gray-600">Points Earned</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Insights;
