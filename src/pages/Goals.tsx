
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import AddGoalForm from "@/components/goals/AddGoalForm";
import GoalList from "@/components/goals/GoalList";
import { useGoals } from "@/hooks/useGoals";

const Goals = () => {
  const {
    goals,
    editingGoal,
    setEditingGoal,
    handleAddGoal,
    deleteGoal,
    updateGoal,
    updateSubGoal,
    addSubGoal,
    deleteSubGoal,
    toggleTimer,
    formatTime,
  } = useGoals();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-stretch xl:px-8 px-4 pt-6 bg-transparent">
          <Toaster />
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-purple-600"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                <path d="M10 3v4a2 2 0 0 1-2 2H2" />
                <path d="M14 3v4a2 2 0 0 0 2 2h6" />
              </svg>
              <span className="text-lg font-semibold text-gray-800">
                Goals
              </span>
            </div>
          </div>

          {/* ADD NEW GOAL FORM */}
          <AddGoalForm onAddGoal={handleAddGoal} />

          {/* GOALS LIST */}
          <GoalList
            goals={goals}
            editingGoal={editingGoal}
            setEditingGoal={setEditingGoal}
            updateGoal={updateGoal}
            deleteGoal={deleteGoal}
            toggleTimer={toggleTimer}
            updateSubGoal={updateSubGoal}
            addSubGoal={addSubGoal}
            deleteSubGoal={deleteSubGoal}
            formatTime={formatTime}
          />

          {goals.length === 0 && (
            <div className="text-center py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10 text-gray-400 mx-auto mb-3"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                <path d="M10 3v4a2 2 0 0 1-2 2H2" />
                <path d="M14 3v4a2 2 0 0 0 2 2h6" />
              </svg>
              <p className="text-gray-500">No goals yet. Start adding some!</p>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Goals;
