
import { Clock, ArrowRight } from "lucide-react";

export function RoutineBanner() {
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
            <span className="text-lg font-bold text-gray-900">You woke up at 8:00 AM</span>
            <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              Late start
            </div>
          </div>
          <div className="text-gray-600 mb-2">
            Skipping <span className="font-semibold text-gray-800">Naam Jaap</span> for now.
          </div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold">
            <span>Do it in the evening instead</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="p-2 bg-white/50 backdrop-blur-sm rounded-xl">
            <div className="text-xs text-gray-500 mb-1">Suggested time</div>
            <div className="text-sm font-bold text-gray-800">6:00 PM</div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-16 translate-x-16"></div>
    </div>
  );
}
