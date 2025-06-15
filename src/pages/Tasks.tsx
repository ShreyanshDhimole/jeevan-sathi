
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { CheckSquare, Plus, Star } from "lucide-react";

const Tasks = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-stretch xl:px-8 px-4 pt-6 bg-transparent">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-gray-800">Tasks</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Today's Tasks</h2>
                <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                  <Plus className="h-4 w-4" />
                  New Task
                </button>
              </div>
              
              <div className="space-y-3">
                {[
                  { task: "Complete project proposal", priority: "high", completed: false },
                  { task: "Call insurance company", priority: "medium", completed: true },
                  { task: "Buy groceries", priority: "low", completed: false },
                  { task: "Schedule dentist appointment", priority: "medium", completed: false },
                  { task: "Review team feedback", priority: "high", completed: true },
                ].map((item, index) => (
                  <div key={index} className={`flex items-center gap-4 p-3 rounded-lg border ${
                    item.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                  }`}>
                    <input 
                      type="checkbox" 
                      checked={item.completed}
                      className="h-4 w-4 text-green-600 rounded"
                      readOnly
                    />
                    <div className="flex-1">
                      <div className={`font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {item.task}
                      </div>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      item.priority === 'high' ? 'bg-red-100 text-red-700' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.priority}
                    </div>
                    <Star className="h-4 w-4 text-gray-400" />
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

export default Tasks;
