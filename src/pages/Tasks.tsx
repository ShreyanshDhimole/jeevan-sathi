
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { CheckSquare, Plus, Star, Trash2 } from "lucide-react";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { useTasks } from "@/hooks/useTasks";
import { Celebration } from "@/components/Celebration";

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

  return (
    <SidebarProvider>
      {/* Celebration confetti */}
      <Celebration trigger={showCelebration} onDone={() => setShowCelebration(false)} />
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col px-3 md:px-4 xl:px-8 pt-4 md:pt-6 bg-transparent">
          <div className="flex items-center gap-4 mb-4 md:mb-6">
            <SidebarTrigger />
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-gray-800">Tasks</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Today's Tasks</h2>
                <button 
                  onClick={() => setIsAddTaskOpen(true)}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors w-fit"
                >
                  <Plus className="h-4 w-4" />
                  New Task
                </button>
              </div>
              
              <div className="space-y-3">
                {tasks.map((item) => (
                  <div key={item.id} className={`flex items-center gap-3 md:gap-4 p-3 rounded-lg border ${
                    item.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                  }`}>
                    <button onClick={() => handleToggleComplete(item.id)} className="flex-shrink-0">
                      <input 
                        type="checkbox" 
                        checked={item.completed}
                        className="h-4 w-4 text-green-600 rounded"
                        readOnly
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm md:text-base ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {item.task}
                      </div>
                      {item.duration && (
                        <div className="text-xs text-gray-500">{item.duration} min</div>
                      )}
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                      item.priority === 'high' ? 'bg-red-100 text-red-700' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.priority}
                    </div>
                    <button onClick={() => toggleStar(item.id)} className="flex-shrink-0">
                      <Star className={`h-4 w-4 ${item.starred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                    <button 
                      onClick={() => deleteTask(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
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
