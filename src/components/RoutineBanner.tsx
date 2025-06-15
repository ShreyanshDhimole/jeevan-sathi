
import { Clock, ArrowRight } from "lucide-react";
import { RoutineItem } from "@/types/routine";

interface Props {
  wakeUpTime?: string | null;
  routineItems: RoutineItem[];
  suggestedRoutine?: RoutineItem;
}

/**
* Fully dynamic banner: messages and labels based on real routine data and wake time.
* No hardcoded text remains for specific tasks or times.
*/
export function RoutineBanner({
  wakeUpTime,
  routineItems,
  suggestedRoutine,
}: Props) {
  // Determine the first/main routine (usually earliest/highest priority)
  const mainRoutine = suggestedRoutine ?? routineItems.slice().sort((a, b) => {
    const parseTime = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    return parseTime(
      (a.time.match(/\d+:\d+/) || ["00:00"])[0]
    ) - parseTime(
      (b.time.match(/\d+:\d+/) || ["00:00"])[0]
    );
  })[0];

  // Dynamically calculate late: if actual wakeUpTime is more than 30min after first routine's scheduled time
  let isLate = false;
  let deltaMinutes = 0;
  if (wakeUpTime && mainRoutine?.time) {
    const parseMinutes = (str: string) => {
      // Accepts '06:00 AM' or '6:00', '06:00' etc
      if (str.includes("AM") || str.includes("PM")) {
        const [time, suffix] = str.split(" ");
        let [h, m] = time.split(":").map(Number);
        if (suffix.toLowerCase() === "pm" && h < 12) h += 12;
        if (suffix.toLowerCase() === "am" && h === 12) h = 0;
        return h * 60 + m;
      } else {
        let [h, m] = str.split(":").map(Number);
        return h * 60 + m;
      }
    };
    const scheduled = parseMinutes(mainRoutine.time);
    const actual = parseMinutes(wakeUpTime);
    deltaMinutes = actual - scheduled;
    isLate = deltaMinutes > 30;
  }

  // Dynamic suggested time: earliest task
  const suggestedTime = mainRoutine?.time || "";

  // Dynamic task name
  const mainTask = mainRoutine?.task || "your main routine task";

  // Messaging completely dynamic based on actual state
  let statusLabel = "";
  let statusClass = "";
  let subText = "";
  let suggestion = null;

  if (!wakeUpTime) {
    statusLabel = "";
    subText = "Press the button to start the day and calibrate your routine.";
  } else if (isLate) {
    statusLabel = "Late start";
    statusClass = "bg-blue-100 text-blue-700";
    subText = `You missed "${mainTask}" at the scheduled time.`;
    suggestion = (
      <>
        <span>
          Do <span className="font-semibold">{mainTask}</span> later if possible, or adjust tomorrow!
        </span>
        <ArrowRight className="h-4 w-4" />
      </>
    );
  } else {
    statusLabel = "On time";
    statusClass = "bg-green-100 text-green-700";
    subText = `Let's begin your day with "${mainTask}"!`;
    suggestion = (
      <>
        <span>
          Keep your streak for <span className="font-semibold">{mainTask}</span>!
        </span>
      </>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100/50 mb-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
      <div className="relative flex items-center gap-4 p-6">
        <div className="flex-shrink-0">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <Clock className="text-white h-7 w-7" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-gray-900">
              {wakeUpTime
                ? `You woke up at ${wakeUpTime}`
                : "Waiting for you to start your day..."}
            </span>
            {!!statusLabel && (
              <div className={`px-2 py-1 ${statusClass} text-xs font-medium rounded-full`}>
                {statusLabel}
              </div>
            )}
          </div>
          <div className="text-gray-600 mb-2">
            {subText}
          </div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold">
            {suggestion}
          </div>
        </div>
        {/* Suggested time dynamically shown */}
        <div className="hidden sm:block">
          <div className="p-2 bg-white/50 backdrop-blur-sm rounded-xl">
            <div className="text-xs text-gray-500 mb-1">Suggested time</div>
            <div className="text-sm font-bold text-gray-800">
              {suggestedTime}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-16 translate-x-16"></div>
    </div>
  );
}
