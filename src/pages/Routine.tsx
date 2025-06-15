
import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Clock, Plus, CheckCircle, AlertTriangle, RotateCcw } from "lucide-react";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { RecalibrateDialog } from "@/components/RecalibrateDialog";

interface RoutineItem {
  id: string;
  time: string;
  task: string;
  status: 'completed' | 'current' | 'upcoming' | 'missed';
  priority: 'high' | 'medium' | 'low';
  flexible: boolean;
}

const Routine = () => {
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([
    { id: '1', time: "6:00 AM", task: "Naam Jaap", status: "completed", priority: "high", flexible: true },
    { id: '2', time: "7:00 AM", task: "Morning Exercise", status: "completed", priority: "medium", flexible: true },
    { id: '3', time: "8:00 AM", task: "Breakfast", status: "current", priority: "high", flexible: false },
    { id: '4', time: "9:00 AM", task: "Work Focus Time", status: "upcoming", priority: "high", flexible: false },
    { id: '5', time: "12:00 PM", task: "Lunch Break", status: "upcoming", priority: "medium", flexible: true },
    { id: '6', time: "6:00 PM", task: "Evening Meditation", status: "upcoming", priority: "high", flexible: true },
  ]);

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isRecalibrateOpen, setIsRecalibrateOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateRoutineStatus();
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const updateRoutineStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    setRoutineItems(prev => prev.map(item => {
      const [time, period] = item.time.split(' ');
      const [hour, minute] = time.split(':').map(Number);
      const itemHour = period === 'PM' && hour !== 12 ? hour + 12 : (period === 'AM' && hour === 12 ? 0 : hour);
      
      const itemTime = itemHour * 60 + minute;
      const nowTime = currentHour * 60 + currentMinute;

      if (item.status === 'upcoming' && nowTime > itemTime + 30) {
        return { ...item, status: 'missed' as const };
      }
      if (item.status === 'upcoming' && nowTime >= itemTime - 15 && nowTime <= itemTime + 15) {
        return { ...item, status: 'current' as const };
      }
      return item;
    }));
  };

  const addTask = (newTask: { task: string; priority: 'high' | 'medium' | 'low'; preferredTime: string; flexible: boolean }) => {
    const newId = (routineItems.length + 1).toString();
    const newRoutineItem: RoutineItem = {
      id: newId,
      time: newTask.preferredTime,
      task: newTask.task,
      status: 'upcoming',
      priority: newTask.priority,
      flexible: newTask.flexible
    };

    setRoutineItems(prev => [...prev, newRoutineItem].sort((a, b) => {
      const timeA = convertTimeToMinutes(a.time);
      const timeB = convertTimeToMinutes(b.time);
      return timeA - timeB;
    }));
  };

  const convertTimeToMinutes = (time: string) => {
    const [timeStr, period] = time.split(' ');
    const [hour, minute] = timeStr.split(':').map(Number);
    const hour24 = period === 'PM' && hour !== 12 ? hour + 12 : (period === 'AM' && hour === 12 ? 0 : hour);
    return hour24 * 60 + minute;
  };

  const markComplete = (id: string) => {
    setRoutineItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'completed' as const } : item
    ));
  };

  const recalibrateRoutine = () => {
    const missedTasks = routineItems.filter(item => item.status === 'missed' && item.flexible);
    const upcomingTasks = routineItems.filter(item => item.status === 'upcoming');
    
    // Logic to reschedule missed flexible tasks
    console.log('Recalibrating routine with missed tasks:', missedTasks);
    setIsRecalibrateOpen(true);
  };

  const getMissedTasksCount = () => routineItems.filter(item => item.status === 'missed').length;

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
          
          {getMissedTasksCount() > 0 && (
            <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-800 font-medium">
                    You have {getMissedTasksCount()} missed tasks. Let me help you recalibrate!
                  </span>
                </div>
                <button 
                  onClick={recalibrateRoutine}
                  className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Recalibrate Now
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
                <button 
                  onClick={() => setIsAddTaskOpen(true)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Task
                </button>
              </div>
              
              <div className="space-y-3">
                {routineItems.map((item) => (
                  <div key={item.id} className={`flex items-center gap-4 p-3 rounded-lg border ${
                    item.status === 'completed' ? 'bg-green-50 border-green-200' :
                    item.status === 'current' ? 'bg-blue-50 border-blue-200' :
                    item.status === 'missed' ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <button
                      onClick={() => item.status !== 'completed' && markComplete(item.id)}
                      disabled={item.status === 'completed'}
                    >
                      <CheckCircle className={`h-5 w-5 cursor-pointer ${
                        item.status === 'completed' ? 'text-green-600' :
                        item.status === 'current' ? 'text-blue-600' :
                        item.status === 'missed' ? 'text-red-600' :
                        'text-gray-400'
                      }`} />
                    </button>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        item.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {item.task}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{item.time}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.priority === 'high' ? 'bg-red-100 text-red-700' :
                          item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {item.priority}
                        </span>
                        {item.flexible && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                            Flexible
                          </span>
                        )}
                      </div>
                    </div>
                    {item.status === 'current' && (
                      <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full animate-pulse">
                        Current
                      </div>
                    )}
                    {item.status === 'missed' && (
                      <div className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        Missed
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <AddTaskDialog 
        isOpen={isAddTaskOpen} 
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={addTask}
      />

      <RecalibrateDialog
        isOpen={isRecalibrateOpen}
        onClose={() => setIsRecalibrateOpen(false)}
        missedTasks={routineItems.filter(item => item.status === 'missed')}
        upcomingTasks={routineItems.filter(item => item.status === 'upcoming')}
      />
    </SidebarProvider>
  );
};

export default Routine;
