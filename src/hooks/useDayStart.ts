
import { useState, useEffect } from "react";

// Returns [hasStarted, wakeUpTime, startDay()]
export function useDayStart() {
  const [hasStarted, setHasStarted] = useState(false);
  const [wakeUpTime, setWakeUpTime] = useState<string | null>(null);

  // Helper to get today's key (resets after 2am, allows late nights)
  function getDayKey() {
    const now = new Date();
    if (now.getHours() < 2) {
      // Before 2am, count as "yesterday"
      now.setDate(now.getDate() - 1);
    }
    return now.toISOString().slice(0, 10); // YYYY-MM-DD
  }

  useEffect(() => {
    const key = getDayKey();
    const stored = localStorage.getItem("dayStart-" + key);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setHasStarted(true);
        setWakeUpTime(data.wakeUpTime);
      } catch { /* ignore */ }
    }
  }, []);

  // Called when user starts their day
  function startDay() {
    const now = new Date();
    const key = getDayKey();
    const wakeTime = now.toTimeString().slice(0, 5); // "HH:mm"
    setHasStarted(true);
    setWakeUpTime(wakeTime);
    localStorage.setItem("dayStart-" + key, JSON.stringify({ wakeUpTime: wakeTime }));
  }

  // At 2am, reset for next day
  useEffect(() => {
    const now = new Date();
    let msTo2am;
    if (now.getHours() >= 2) {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(2, 0, 0, 0);
      msTo2am = tomorrow.getTime() - now.getTime();
    } else {
      const today2am = new Date(now);
      today2am.setHours(2, 0, 0, 0);
      msTo2am = today2am.getTime() - now.getTime();
    }
    const timer = setTimeout(() => {
      setHasStarted(false);
      setWakeUpTime(null);
    }, msTo2am + 1000);
    return () => clearTimeout(timer);
  }, [hasStarted]);

  return [hasStarted, wakeUpTime, startDay] as const;
}
