
import { Clock, Target, Gift, TrendingUp, Calendar, CheckCircle2, Star, Zap } from "lucide-react";

interface RoutineSummary {
  completed: number;
  total: number;
  currentTask?: string;
  nextTask?: string;
  nextTime?: string;
  progressRatio: string;
}

interface TaskSummary {
  left: number;
  items: { id: string; name: string }[];
}

interface GoalSummary {
  name: string;
  percent: number;
  completedDays: number;
  totalDays: number;
  daysLeft: number;
}

interface RewardsSummary {
  totalPoints: number;
  streak: number;
  nextRewardAt: number;
  lastPoints: number;
}

interface ReminderItem {
  id: string;
  label: string;
  time: string;
}

interface WeeklyProgress {
  percent: number;
  bars: number[];
  improving: boolean;
}

interface DashboardTilesProps {
  routine: RoutineSummary;
  tasks: TaskSummary;
  goal: GoalSummary;
  rewards: RewardsSummary;
  reminders: ReminderItem[];
  weekly: WeeklyProgress;
}

export function DashboardTiles({
  routine,
  tasks,
  goal,
  rewards,
  reminders,
  weekly,
}: DashboardTilesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {/* Today's Routine */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Clock className="h-6 w-6" />
            </div>
            <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              {routine.completed}/{routine.total} Done
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Today's Routine</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span className="text-sm opacity-90">
                Current: {routine.currentTask ?? "-"}
              </span>
            </div>
            <div className="text-xs opacity-75">
              Next: {routine.nextTask ? `${routine.nextTask} (${routine.nextTime})` : "—"}
            </div>
          </div>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: routine.progressRatio }}
            ></div>
          </div>
        </div>
      </div>
      {/* Quick Tasks */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              {tasks.left} Left
            </div>
          </div>
          <h3 className="text-xl font-bold mb-4">Quick Tasks</h3>
          <div className="space-y-2">
            {tasks.items.length ? (
              tasks.items.slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 bg-white/10 rounded-xl">
                  <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>
                  <span className="text-sm flex-1">{item.name}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-white/70 italic px-2">No quick tasks</div>
            )}
          </div>
        </div>
      </div>
      {/* Goal Progress */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Target className="h-6 w-6" />
            </div>
            <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              {goal.percent}%
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">{goal.name || "Goal"}</h3>
          <div className="text-sm opacity-90 mb-4">
            {goal.completedDays} of {goal.totalDays} days completed
          </div>
          <div className="bg-white/20 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-yellow-300 to-orange-300 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${goal.percent}%` }}
            ></div>
          </div>
          <div className="text-xs opacity-75">{goal.daysLeft} days remaining</div>
        </div>
      </div>
      {/* Points & Rewards */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Star className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              <Zap className="h-3 w-3" />
              +{rewards.lastPoints}
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">{rewards.totalPoints} Points</h3>
          <div className="text-sm opacity-90 mb-4">Streak: {rewards.streak} days 🔥</div>
          <div className="space-y-2">
            <div className="text-xs opacity-75">
              Next reward at {rewards.nextRewardAt} pts
            </div>
            <div className="bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(
                  (rewards.totalPoints / rewards.nextRewardAt) * 100,
                  100
                )}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      {/* Smart Reminders */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-rose-600 to-red-600 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              {reminders.length} Active
            </div>
          </div>
          <h3 className="text-xl font-bold mb-4">Smart Reminders</h3>
          <div className="space-y-2">
            {reminders.length ? (
              reminders.slice(0, 2).map((r) => (
                <div key={r.id} className="p-2 bg-white/10 rounded-xl">
                  <div className="text-sm font-medium">{r.label}</div>
                  <div className="text-xs opacity-75">{r.time}</div>
                </div>
              ))
            ) : (
              <div className="text-xs text-white/70 italic px-2">No reminders</div>
            )}
          </div>
        </div>
      </div>
      {/* Weekly Progress */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              {weekly.percent > 0 ? `+${weekly.percent}%` : "0%"}
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Weekly Progress</h3>
          <div className="text-sm opacity-90 mb-4">
            {weekly.improving ? "You're improving! 🚀" : "Stay consistent!"}
          </div>
          <div className="flex items-end gap-1 h-12">
            {weekly.bars.map((height, i) => (
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

