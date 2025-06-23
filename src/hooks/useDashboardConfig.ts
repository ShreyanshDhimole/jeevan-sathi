
import { useMemo } from "react";
import { RoutineItem } from "@/types/routine";
import { getPoints } from "@/utils/pointsStorage";

export function useDashboardConfig(routineItems: RoutineItem[] = []) {
  return useMemo(() => {
    const totalPoints = getPoints();
    const completedToday = routineItems.filter(item => item.status === 'completed').length;
    const totalTasks = routineItems.length;
    const missedTasks = routineItems.filter(item => item.status === 'missed').length;
    
    return [
      {
        key: "points",
        title: "Points",
        icon: "Star",
        bgClass: "from-yellow-400 to-orange-500",
        getData: () => ({
          totalPoints,
          statusText: "Active",
          label: "Total Points",
          lastPoints: 25,
          nextRewardAt: 500
        })
      },
      {
        key: "routine",
        title: "Today's Progress",
        icon: "Target",
        bgClass: "from-green-400 to-blue-500",
        getData: () => ({
          statusText: "On Track",
          currentLabel: "Completed",
          mainText: `${completedToday}/${totalTasks}`,
          nextLabel: "Next Task",
          nextText: routineItems.find(item => item.status === 'upcoming')?.task || "All done!",
          progress: totalTasks > 0 ? `${(completedToday / totalTasks) * 100}%` : "0%"
        })
      },
      {
        key: "tasks",
        title: "Quick Tasks",
        icon: "CheckCircle2",
        bgClass: "from-purple-400 to-pink-500",
        getData: () => ({
          statusText: "Ready",
          preview: routineItems.filter(item => item.status === 'upcoming').slice(0, 3)
        })
      },
      {
        key: "rewards",
        title: "Rewards",
        icon: "Gift",
        bgClass: "from-pink-400 to-red-500",
        getData: () => ({
          totalPoints,
          statusText: "Available",
          streak: 3,
          nextRewardAt: 500,
          progress: `${(totalPoints % 500) / 5}%`
        })
      }
    ];
  }, [routineItems]);
}
