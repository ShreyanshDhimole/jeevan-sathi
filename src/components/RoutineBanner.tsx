
import { Clock } from "lucide-react";

export function RoutineBanner() {
  // Simulate "woke up late" banner
  return (
    <div className="flex items-center gap-3 px-6 py-4 mb-4 rounded-xl bg-blue-50 border border-blue-100 animate-fade-in">
      <Clock className="text-blue-500" size={28} />
      <div>
        <span className="font-medium">You woke up at 8:00 AM</span>
        <br />
        <span className="text-sm text-muted-foreground">
          Skipping <span className="font-semibold">Naam Jaap</span> for now.<br />
          <span className="text-blue-600 font-semibold">Do it in the evening.</span>
        </span>
      </div>
    </div>
  );
}
