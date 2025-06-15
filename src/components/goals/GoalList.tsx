
import React from "react";
import GoalCard, { SubGoal } from "./GoalCard";

interface Goal {
  id: string;
  title: string;
  progress: number;
  subGoals: SubGoal[];
  timerState: {
    isRunning: boolean;
    startTime: number | null;
    currentTime: number;
  };
}

interface GoalListProps {
  goals: Goal[];
  editingGoal: string | null;
  setEditingGoal: (id: string | null) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleTimer: (id: string) => void;
  updateSubGoal: (
    goalId: string,
    subGoalId: string,
    updates: Partial<{ title: string; isCompleted: boolean }>
  ) => void;
  addSubGoal: (goalId: string, subTitle: string) => void;
  deleteSubGoal: (goalId: string, subGoalId: string) => void;
  formatTime: (seconds: number) => string;
}

const GoalList: React.FC<GoalListProps> = ({
  goals,
  editingGoal,
  setEditingGoal,
  updateGoal,
  deleteGoal,
  toggleTimer,
  updateSubGoal,
  addSubGoal,
  deleteSubGoal,
  formatTime,
}) => (
  <div className="space-y-4">
    {goals.map((goal) => (
      <GoalCard
        key={goal.id}
        goal={goal}
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
    ))}
  </div>
);

export default GoalList;
