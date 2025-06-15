
import { RoutineItem } from "@/types/routine";

export interface RecalibrationResult {
  success: boolean;
  adjustedTasks: RoutineItem[];
  compressions: Array<{
    taskId: string;
    originalDuration: number;
    newDuration: number;
  }>;
  message: string;
}

export const recalibrateWithUrgentTask = (
  routineItems: RoutineItem[],
  urgentTask: { task: string; duration: number },
  currentTime: Date
): RecalibrationResult => {
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // Find the next fixed task after current time
  const upcomingTasks = routineItems
    .filter(item => item.status === 'upcoming')
    .sort((a, b) => convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time));

  const nextFixedTask = upcomingTasks.find(task => 
    !task.flexible && convertTimeToMinutes(task.time) > currentTimeInMinutes
  );

  if (!nextFixedTask) {
    return {
      success: false,
      adjustedTasks: [],
      compressions: [],
      message: "No fixed tasks found to work around. Please add the urgent task manually."
    };
  }

  const nextFixedTaskTime = convertTimeToMinutes(nextFixedTask.time);
  const availableTime = nextFixedTaskTime - currentTimeInMinutes - urgentTask.duration;

  // Get flexible tasks that need to be rescheduled
  const flexibleTasksToAdjust = upcomingTasks.filter(task => 
    task.flexible && 
    convertTimeToMinutes(task.time) > currentTimeInMinutes &&
    convertTimeToMinutes(task.time) < nextFixedTaskTime
  );

  // Calculate total time needed for flexible tasks
  const totalFlexibleTime = flexibleTasksToAdjust.reduce((sum, task) => sum + task.duration, 0);

  let adjustedTasks = [...routineItems];
  let compressions: Array<{ taskId: string; originalDuration: number; newDuration: number }> = [];

  // Create the urgent task
  const urgentTaskItem: RoutineItem = {
    id: `urgent-${Date.now()}`,
    time: formatMinutesToTime(currentTimeInMinutes + 5), // Start in 5 minutes
    task: urgentTask.task,
    status: 'upcoming' as const,
    priority: 'high' as const,
    flexible: false,
    points: 0,
    streak: 0,
    completionHistory: [],
    duration: urgentTask.duration,
    compressible: false
  };

  if (totalFlexibleTime <= availableTime) {
    // Simple case: everything fits, just shift times
    let currentSlotTime = currentTimeInMinutes + urgentTask.duration + 10; // 10 min buffer

    flexibleTasksToAdjust.forEach(task => {
      const taskIndex = adjustedTasks.findIndex(t => t.id === task.id);
      if (taskIndex !== -1) {
        adjustedTasks[taskIndex] = {
          ...task,
          time: formatMinutesToTime(currentSlotTime)
        };
        currentSlotTime += task.duration + 5; // 5 min buffer between tasks
      }
    });

    adjustedTasks.push(urgentTaskItem);

    return {
      success: true,
      adjustedTasks,
      compressions,
      message: `Successfully rescheduled ${flexibleTasksToAdjust.length} flexible tasks to fit your urgent task.`
    };
  } else {
    // Need to compress some tasks
    let timeToSave = totalFlexibleTime - availableTime;
    
    const compressibleTasks = flexibleTasksToAdjust.filter(task => 
      task.compressible && task.minDuration
    );

    if (compressibleTasks.length === 0) {
      return {
        success: false,
        adjustedTasks: [],
        compressions: [],
        message: "Not enough time available and no tasks can be compressed. Consider rescheduling some tasks manually."
      };
    }

    // Try to compress tasks to make room
    let currentSlotTime = currentTimeInMinutes + urgentTask.duration + 10;

    for (const task of flexibleTasksToAdjust) {
      const taskIndex = adjustedTasks.findIndex(t => t.id === task.id);
      let newDuration = task.duration;

      if (task.compressible && task.minDuration && timeToSave > 0) {
        const maxReduction = task.duration - task.minDuration;
        const reduction = Math.min(maxReduction, timeToSave);
        newDuration = task.duration - reduction;
        timeToSave -= reduction;

        compressions.push({
          taskId: task.id,
          originalDuration: task.duration,
          newDuration
        });
      }

      if (taskIndex !== -1) {
        adjustedTasks[taskIndex] = {
          ...task,
          time: formatMinutesToTime(currentSlotTime),
          duration: newDuration
        };
        currentSlotTime += newDuration + 5;
      }
    }

    adjustedTasks.push(urgentTaskItem);

    return {
      success: true,
      adjustedTasks,
      compressions,
      message: `Rescheduled tasks with ${compressions.length} compressions to fit your urgent task.`
    };
  }
};

const convertTimeToMinutes = (time: string): number => {
  const [timeStr, period] = time.split(' ');
  const [hour, minute] = timeStr.split(':').map(Number);
  const hour24 = period === 'PM' && hour !== 12 ? hour + 12 : (period === 'AM' && hour === 12 ? 0 : hour);
  return hour24 * 60 + minute;
};

const formatMinutesToTime = (minutes: number): string => {
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const period = hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
};
