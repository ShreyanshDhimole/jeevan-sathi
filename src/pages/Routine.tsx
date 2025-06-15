
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Clock, Plus, CheckCircle } from "lucide-react";

const Routine = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-stretch xl:px-8 px-4 pt-6 bg-transparent">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold text-gray-800">Daily Routine</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
                <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  <Plus className="h-4 w-4" />
                  Add Task
                </button>
              </div>
              
              <div className="space-y-3">
                {[
                  { time: "6:00 AM", task: "Naam Jaap", status: "completed" },
                  { time: "7:00 AM", task: "Morning Exercise", status: "completed" },
                  { time: "8:00 AM", task: "Breakfast", status: "current" },
                  { time: "9:00 AM", task: "Work Focus Time", status: "upcoming" },
                  { time: "12:00 PM", task: "Lunch Break", status: "upcoming" },
                  { time: "6:00 PM", task: "Evening Meditation", status: "upcoming" },
                ].map((item, index) => (
                  <div key={index} className={`flex items-center gap-4 p-3 rounded-lg ${
                    item.status === 'completed' ? 'bg-green-50 border border-green-200' :
                    item.status === 'current' ? 'bg-blue-50 border border-blue-200' :
                    'bg-gray-50 border border-gray-200'
                  }`}>
                    <CheckCircle className={`h-5 w-5 ${
                      item.status === 'completed' ? 'text-green-600' :
                      item.status === 'current' ? 'text-blue-600' :
                      'text-gray-400'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.task}</div>
                      <div className="text-sm text-gray-500">{item.time}</div>
                    </div>
                    {item.status === 'current' && (
                      <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Current
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Routine;
