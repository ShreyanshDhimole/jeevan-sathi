
import { Clock, Target, Gift, TrendingUp, Calendar, CheckCircle2, Star, Zap } from "lucide-react";

export function DashboardTiles() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {/* Today's Routine - Enhanced */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Clock className="h-6 w-6" />
            </div>
            <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              5/8 Done
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Today's Routine</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span className="text-sm opacity-90">Current: Work Session</span>
            </div>
            <div className="text-xs opacity-75">Next: Lunch Break (12:30 PM)</div>
          </div>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full w-5/8 transition-all duration-500"></div>
          </div>
        </div>
      </div>

      {/* Quick Tasks - Enhanced */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              3 Left
            </div>
          </div>
          <h3 className="text-xl font-bold mb-4">Quick Tasks</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-white/10 rounded-xl">
              <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>
              <span className="text-sm flex-1">Call dentist</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-white/10 rounded-xl">
              <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>
              <span className="text-sm flex-1">Buy groceries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Progress - Enhanced */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Target className="h-6 w-6" />
            </div>
            <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              75%
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Learn Python</h3>
          <div className="text-sm opacity-90 mb-4">22 of 30 days completed</div>
          <div className="bg-white/20 rounded-full h-3 mb-2">
            <div className="bg-gradient-to-r from-yellow-300 to-orange-300 h-3 rounded-full w-3/4 transition-all duration-500 shadow-sm"></div>
          </div>
          <div className="text-xs opacity-75">8 days remaining</div>
        </div>
      </div>

      {/* Points & Rewards - Enhanced */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Star className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              <Zap className="h-3 w-3" />
              +15
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">1,250 Points</h3>
          <div className="text-sm opacity-90 mb-4">Streak: 7 days 🔥</div>
          <div className="space-y-2">
            <div className="text-xs opacity-75">Next reward at 1,500 pts</div>
            <div className="bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full w-4/5 transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Reminders - Enhanced */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-rose-600 to-red-600 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              2 Active
            </div>
          </div>
          <h3 className="text-xl font-bold mb-4">Smart Reminders</h3>
          <div className="space-y-2">
            <div className="p-2 bg-white/10 rounded-xl">
              <div className="text-sm font-medium">Dadi ki medicine</div>
              <div className="text-xs opacity-75">Today 6:00 PM</div>
            </div>
            <div className="p-2 bg-white/10 rounded-xl">
              <div className="text-sm font-medium">Aadhaar card</div>
              <div className="text-xs opacity-75">Tomorrow</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress - Enhanced */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              +12%
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Weekly Progress</h3>
          <div className="text-sm opacity-90 mb-4">You're improving! 🚀</div>
          <div className="flex items-end gap-1 h-12">
            {[40, 60, 45, 80, 65, 90, 75].map((height, i) => (
              <div
                key={i}
                className="bg-white/30 rounded-t flex-1 transition-all duration-500 hover:bg-white/50"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
