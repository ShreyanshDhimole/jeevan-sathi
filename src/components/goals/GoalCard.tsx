import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Trash, Edit, Clock, Play, Square, Plus } from "lucide-react";
import type { SubGoal } from "@/hooks/useGoals";

// Props same as before except recursive subgoals now supported!
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
    updates: Partial<Omit<SubGoal, "subGoals">>
  ) => void;
  addSubGoal: (goalId: string, title: string, parentSubGoalId?: string) => void;
  deleteSubGoal: (goalId: string, subGoalId: string) => void;
  formatTime: (seconds: number) => string;
}

const SubGoalNode: React.FC<{
  goalId: string;
  subGoal: SubGoal;
  updateSubGoal: GoalCardProps["updateSubGoal"];
  addSubGoal: GoalCardProps["addSubGoal"];
  deleteSubGoal: GoalCardProps["deleteSubGoal"];
}> = ({ goalId, subGoal, updateSubGoal, addSubGoal, deleteSubGoal }) => {
  const [showAddInput, setShowAddInput] = useState(false);
  const [addInput, setAddInput] = useState("");
  return (
    <div className="ml-4 mt-2 border-l-2 border-gray-200 pl-2">
      <div className="flex items-center gap-2">
        <Input
          type="checkbox"
          checked={subGoal.isCompleted}
          onChange={(e) =>
            updateSubGoal(goalId, subGoal.id, {
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
        <Button
          onClick={() => deleteSubGoal(goalId, subGoal.id)}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
          title="Delete sub-goal"
        >
          <Trash className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setShowAddInput((show) => !show)}
          variant="outline"
          size="icon"
          title="Add sub-goal to this sub-goal"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {showAddInput && (
        <div className="flex gap-2 mt-2">
          <Input
            type="text"
            value={addInput}
            onChange={(e) => setAddInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && addInput.trim()) {
                addSubGoal(goalId, addInput.trim(), subGoal.id);
                setAddInput("");
                setShowAddInput(false);
              }
            }}
            placeholder="Add sub-goal..."
            className="flex-1"
            autoFocus
          />
          <Button
            onClick={() => {
              if (addInput.trim()) {
                addSubGoal(goalId, addInput.trim(), subGoal.id);
                setAddInput("");
                setShowAddInput(false);
              }
            }}
            variant="default"
            size="sm"
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      )}
      {/* Render children if any */}
      {subGoal.subGoals && subGoal.subGoals.length > 0 && (
        <div className="mt-2 space-y-2">
          {subGoal.subGoals.map((child) => (
            <SubGoalNode
              key={child.id}
              goalId={goalId}
              subGoal={child}
              updateSubGoal={updateSubGoal}
              addSubGoal={addSubGoal}
              deleteSubGoal={deleteSubGoal}
            />
          ))}
        </div>
      )}
    </div>
  );
};

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
        {/* Recursive sub-goal rendering */}
        {goal.subGoals.map((sg) => (
          <SubGoalNode
            key={sg.id}
            goalId={goal.id}
            subGoal={sg}
            updateSubGoal={updateSubGoal}
            addSubGoal={addSubGoal}
            deleteSubGoal={deleteSubGoal}
          />
        ))}
        {/* Add sub-goal at root level */}
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Add a sub-goal..."
            value={subInput}
            onChange={(e) => setSubInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && subInput.trim()) {
                addSubGoal(goal.id, subInput.trim());
                setSubInput("");
              }
            }}
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
