
import { Task } from "@/hooks/useTasks";
import { RoutineItem } from "@/types/routine";

// Returns array for last 7 days [Mon, Tue, ..., Sun] (or current day ordering)
export function getCompletionCountsByDay({
  tasks,
  routines,
}: {
  tasks: Task[];
  routines: RoutineItem[];
}): number[] {
  // Build days: Mon...Sun, using today
  const todayIdx = new Date().getDay(); // 0 = Sunday, ... 6 = Saturday
  // We'll want Monday as 0, so shift accordingly
  const shift = (todayIdx + 6) % 7; // Mon = 0

  const now = new Date();
  // Array for each weekday, oldest to newest
  const counts = Array(7).fill(0);

  // Look back the last 7 days, oldest to most recent (left to right)
  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const day = new Date(now);
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - dayOffset);

    // For tasks
    const taskDone = tasks.filter(
      (t) =>
        t.completed &&
        t.completedAt &&
        new Date(t.completedAt).toDateString() === day.toDateString()
    ).length;

    // For routines
    const routineDone = routines.filter(
      (r) =>
        r.status === "completed" &&
        r.completedAt &&
        new Date(r.completedAt).toDateString() === day.toDateString()
    ).length;

    counts[6 - dayOffset] = taskDone + routineDone;
  }

  // Rearrange so that output starts from Monday
  // If today is Monday shift=0, output is [Mon,...,Sun]
  return counts
    .slice(shift)
    .concat(counts.slice(0, shift));
}
