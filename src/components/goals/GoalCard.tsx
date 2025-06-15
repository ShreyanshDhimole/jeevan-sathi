
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Trash, Edit, Clock, Play, Square, Plus } from "lucide-react";

export interface SubGoal {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface GoalCardProps {
  goal: {
    id: string;
    title: string;
    progress: number;
    subGoals: SubGoal[];
    timerState: {
      isRunning: boolean;
      startTime: number | null;
      currentTime: number;
    };
  };
  editingGoal: string | null;
  setEditingGoal: (id: string | null) => void;
  updateGoal: (id: string, updates: any) => void;
  deleteGoal: (id: string) => void;
  toggleTimer: (id: string) => void;
  updateSubGoal: (
    goalId: string,
    subGoalId: string,
    updates: Partial<SubGoal>
  ) => void;
  addSubGoal: (goalId: string, title: string) => void;
  deleteSubGoal: (goalId: string, subGoalId: string) => void;
  formatTime: (seconds: number) => string;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  editingGoal,
  setEditingGoal,
  updateGoal,
  deleteGoal,
  toggleTimer,
  updateSubGoal,
  addSubGoal,
  deleteSubGoal,
  formatTime,
}) => {
  const [subInput, setSubInput] = useState("");

  const handleSubInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && subInput.trim() !== "") {
      addSubGoal(goal.id, subInput.trim());
      setSubInput("");
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          {editingGoal === goal.id ? (
            <input
              type="text"
              value={goal.title}
              onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
              onBlur={() => setEditingGoal(null)}
              onKeyDown={(e) => e.key === "Enter" && setEditingGoal(null)}
              className="text-xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 outline-none flex-1"
              autoFocus
            />
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-900 flex-1">
                {goal.title}
              </h3>
              <Button
                onClick={() => setEditingGoal(goal.id)}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
                title="Edit goal title"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {goal.timerState.isRunning && (
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              <Clock className="h-4 w-4" />
              <span>{formatTime(goal.timerState.currentTime)}</span>
            </div>
          )}
          {!goal.timerState.isRunning && goal.timerState.currentTime > 0 && (
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              <Clock className="h-4 w-4" />
              <span>{formatTime(goal.timerState.currentTime)}</span>
            </div>
          )}
          <Button
            onClick={() => toggleTimer(goal.id)}
            variant={goal.timerState.isRunning ? "destructive" : "default"}
            size="sm"
            className="flex items-center gap-2"
          >
            {goal.timerState.isRunning ? (
              <>
                <Square className="h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start
              </>
            )}
          </Button>
          <Button
            onClick={() => deleteGoal(goal.id)}
            variant="destructive"
            size="sm"
            title="Delete goal"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Overall Progress
        </label>
        <div className="flex items-center gap-2 mt-1">
          <Slider
            defaultValue={[goal.progress]}
            max={100}
            step={1}
            onValueChange={(value) =>
              updateGoal(goal.id, { progress: value[0] })
            }
            className="flex-1"
          />
          <span className="text-sm text-gray-500">{goal.progress}%</span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-gray-800">Sub-Goals</h4>
        {goal.subGoals.map((subGoal) => (
          <div
            key={subGoal.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
          >
            <label className="flex items-center gap-2">
              <Input
                type="checkbox"
                checked={subGoal.isCompleted}
                onChange={(e) =>
                  updateSubGoal(goal.id, subGoal.id, {
                    isCompleted: e.target.checked,
                  })
                }
                className="h-5 w-5 rounded-sm border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span
                className={
                  subGoal.isCompleted
                    ? "line-through text-gray-500"
                    : "text-gray-700"
                }
              >
                {subGoal.title}
              </span>
            </label>
            <Button
              onClick={() => deleteSubGoal(goal.id, subGoal.id)}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              title="Delete sub-goal"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Add a sub-goal..."
            value={subInput}
            onChange={(e) => setSubInput(e.target.value)}
            onKeyDown={handleSubInputKeyDown}
            className="flex-1"
          />
          <Button
            onClick={() => {
              if (subInput.trim() !== "") {
                addSubGoal(goal.id, subInput.trim());
                setSubInput("");
              }
            }}
            size="sm"
            variant="outline"
            title="Add sub-goal"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
