
import type { SubGoal } from "@/hooks/useGoals";

/**
 * Recursively counts all sub-goals and completed sub-goals.
 * Returns an object with {total, completed}.
 */
export function countSubGoals(subGoals: SubGoal[]): { total: number; completed: number } {
  return subGoals.reduce(
    (acc, sg) => {
      const inner = countSubGoals(sg.subGoals ?? []);
      return {
        total: acc.total + 1 + inner.total,
        completed: acc.completed + (sg.isCompleted ? 1 : 0) + inner.completed,
      };
    },
    { total: 0, completed: 0 }
  );
}
