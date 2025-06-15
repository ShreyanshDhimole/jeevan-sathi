
import React, { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Clock, Plus, Trophy } from "lucide-react";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { RecalibrateDialog } from "@/components/RecalibrateDialog";
import { TaskTracker } from "@/components/TaskTracker";
import { ReminderSystem } from "@/components/ReminderSystem";
import { StreakRewards } from "@/components/StreakRewards";
import { Celebration } from "@/components/Celebration";
import RoutineList from "@/components/RoutineList";
import { useRoutine } from "@/hooks/useRoutine";

const Routine = () => {
  const {
    routineItems,
    setRoutineItems,
    displayRoutineItems,
    addTask,
    deleteRoutineItem,
    isAddTaskOpen,
    setIsAddTaskOpen,
    isRecalibrateOpen,
    setIsRecalibrateOpen,
    isTaskTrackerOpen,
    setIsTaskTrackerOpen,
    selectedTask,
    setSelectedTask,
    isStreakRewardOpen,
    setIsStreakRewardOpen,
    streakReward,
    setStreakReward,
    handleTaskClick,
    handleTaskStart,
    handleTaskComplete,
    updateTask,
    totalPoints,
    // REMOVED setTotalPoints,
    getMissedTasksCount,
    closeTaskTracker,
    closeStreakReward,
    showCelebration,
    setShowCelebration,
    triggerAutoRecalibration,
    updateRoutineStatus,
  } = useRoutine();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Set up auto-ticking and recalibration every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateRoutineStatus();
      triggerAutoRecalibration();
    }, 60000);

    updateRoutineStatus();
    triggerAutoRecalibration();

    return () => clearInterval(timer);
  }, [routineItems.length, updateRoutineStatus, triggerAutoRecalibration]);

  return (
    <SidebarProvider>
      <Celebration
        trigger={showCelebration}
        onDone={() => setShowCelebration(false)}
      />
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
            <div className="ml-auto flex items-center gap-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span className="font-bold">{totalPoints} pts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsAddTaskOpen(true)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Task
                  </button>
                </div>
              </div>
              <RoutineList
                displayRoutineItems={displayRoutineItems}
                handleTaskClick={handleTaskClick}
                deleteRoutineItem={deleteRoutineItem}
              />
            </div>
          </div>
        </main>
      </div>
      <ReminderSystem 
        routineItems={routineItems}
        onUpdateTask={updateTask}
      />
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
      {selectedTask && isTaskTrackerOpen && (
        <TaskTracker
          task={selectedTask}
          isOpen={isTaskTrackerOpen}
          onClose={closeTaskTracker}
          onComplete={handleTaskComplete}
          onStart={handleTaskStart}
        />
      )}
      {streakReward && (
        <StreakRewards
          isOpen={isStreakRewardOpen}
          onClose={closeStreakReward}
          reward={streakReward}
          onClaim={() => {
            setShowCelebration(true);
            setIsStreakRewardOpen(false);
            setStreakReward(null);
          }}
        />
      )}
    </SidebarProvider>
  );
};

export default Routine;
