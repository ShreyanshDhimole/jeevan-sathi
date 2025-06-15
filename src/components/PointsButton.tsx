
import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PointsButtonProps {
  points: number;
  className?: string;
}

export const PointsButton: React.FC<PointsButtonProps> = ({ points, className }) => (
  <div
    className={cn(
      "flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-sm font-semibold text-base",
      className
    )}
    style={{ minWidth: 0 }}
    title="Total Points"
  >
    <Star className="h-4 w-4 text-white" />
    <span className="truncate">Points: {points}</span>
  </div>
);
