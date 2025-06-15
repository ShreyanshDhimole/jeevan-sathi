
import React from "react";
import { RoutineItem } from "@/types/routine";
import { Plus, CheckCircle, Play, Star, Trash2 } from "lucide-react";

type Props = {
  displayRoutineItems: RoutineItem[];
  handleTaskClick: (task: RoutineItem) => void;
  deleteRoutineItem: (id: string) => void;
};

export default function RoutineList({ displayRoutineItems, handleTaskClick, deleteRoutineItem }: Props) {
  return (
    <div className="space-y-3">
      {displayRoutineItems.map((item) => (
        <div
          key={item.id}
          className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
            item.status === "completed"
              ? "bg-green-50 border-green-200"
              : item.status === "current"
              ? "bg-blue-50 border-blue-200"
              : item.status === "in-progress"
              ? "bg-purple-50 border-purple-200"
              : item.status === "missed"
              ? "bg-red-50 border-red-200"
              : "bg-gray-50 border-gray-200"
          }`}
          onClick={() => handleTaskClick(item)}
        >
          <div className="flex-shrink-0">
            {item.status === "in-progress" ? (
              <Play className="h-5 w-5 text-purple-600 animate-pulse" />
            ) : (
              <CheckCircle
                className={`h-5 w-5 ${
                  item.status === "completed"
                    ? "text-green-600"
                    : item.status === "current"
                    ? "text-blue-600"
                    : item.status === "missed"
                    ? "text-red-600"
                    : "text-gray-400"
                }`}
              />
            )}
          </div>
          <div className="flex-1">
            <div
              className={`font-medium ${
                item.status === "completed"
                  ? "text-gray-500 line-through"
                  : "text-gray-900"
              }`}
            >
              {item.task}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
              <span>{item.time}</span>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                {item.duration ? `${item.duration}min` : "No duration"}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  item.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : item.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {item.priority}
              </span>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                {item.points} pts
              </span>
              {item.streak > 0 && (
                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {item.streak} day streak
                </span>
              )}
              {item.flexible && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                  Flexible
                </span>
              )}
              {item.compressible && (
                <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                  Compressible
                </span>
              )}
            </div>
          </div>
          {item.status === "current" && (
            <div className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full animate-pulse">
              Time to start!
            </div>
          )}
          {item.status === "in-progress" && (
            <div className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
              In Progress
            </div>
          )}
          {item.status === "missed" && (
            <div className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
              Missed
            </div>
          )}
          {typeof item.quality === "number" && (
            <div className="flex items-center gap-1">
              {[...Array(item.quality)].map((_, i) => (
                <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
              ))}
            </div>
          )}
          <button
            className="ml-3 p-2 rounded hover:bg-red-100 transition-all"
            onClick={e => {
              e.stopPropagation();
              deleteRoutineItem(item.id);
            }}
            aria-label="Delete routine task"
          >
            <Trash2 className="h-5 w-5 text-red-500" />
          </button>
        </div>
      ))}
    </div>
  );
}
