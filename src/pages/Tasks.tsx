
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { CheckSquare, Plus, Star, Trash2 } from "lucide-react";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { useTasks } from "@/hooks/useTasks";
import { Celebration } from "@/components/Celebration"; // Import Celebration

const Tasks = () => {
  const { tasks, addTask, deleteTask, toggleComplete, toggleStar } = useTasks();
  const [isAddTaskOpen, setIsAddTaskOpen] = React.useState(false);

  // Celebration state for confetti
  const [showCelebration, setShowCelebration] = React.useState(false);

  // Wrap toggleComplete to fire celebration only when completing a task (not un-completing)
  const handleToggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      // If task is currently not completed, it will become completed
      setShowCelebration(true);
    }
    toggleComplete(id);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const high = tasks.filter(t => t.priority === 'high' && !t.completed).length;
    return { total, completed, high };
  };

  const stats = getTaskStats();

  return (
    <SidebarProvider>
      {/* Celebration confetti */}
      <Celebration trigger={showCelebration} onDone={() => setShowCelebration(false)} />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-red-600">{stats.high}</div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Today's Tasks</h2>
                <button 
                  onClick={() => setIsAddTaskOpen(true)}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  New Task
                </button>
              </div>
              
              <div className="space-y-3">
                {tasks.map((item) => (
                  <div key={item.id} className={`flex items-center gap-4 p-3 rounded-lg border ${
                    item.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                  }`}>
                    <button onClick={() => handleToggleComplete(item.id)}>
                      <input 
                        type="checkbox" 
                        checked={item.completed}
                        className="h-4 w-4 text-green-600 rounded"
                        readOnly
                      />
                    </button>
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
                    <button onClick={() => toggleStar(item.id)}>
                      <Star className={`h-4 w-4 ${item.starred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                    <button 
                      onClick={() => deleteTask(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
    </SidebarProvider>
  );
};

export default Tasks;
