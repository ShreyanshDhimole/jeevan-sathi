import { Clock, Target, Gift, TrendingUp, Calendar, CheckCircle2, Star, Zap } from "lucide-react";

// Dynamic import icon map
const iconMap = {
  Clock,
  Target,
  Gift,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Star,
  Zap,
};

/**
 * DashboardTiles expects a 'dashboardConfig' prop that contains all
 * layout, textual, and icon config for each dashboard card.
 *
 * No hardcoded text or card content, everything is passed via config and data.
 */
export function DashboardTiles({ dashboardConfig }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {dashboardConfig.map((card) => {
        const CardIcon = iconMap[card.icon] || Calendar;
        const data = card.getData();
        switch (card.key) {
          case "points":
            return (
              <div
                key={card.key}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.bgClass} p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <CardIcon className="h-7 w-7" />
                    </div>
                    <div className="text-sm font-bold bg-white/20 px-4 py-1 rounded-full">
                      {data.statusText}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                  <div className="flex flex-col items-center mb-3">
                    <span className="text-4xl font-extrabold">{data.totalPoints}</span>
                    <span className="text-xs tracking-wide opacity-70">{data.label}</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-4">
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs text-white">
                      Last Earned: +{data.lastPoints}
                    </span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs text-white">
                      Next Reward: {data.nextRewardAt} pts
                    </span>
                  </div>
                </div>
              </div>
            );
          case "routine":
            return (
              <div
                key={card.key}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.bgClass} p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <CardIcon className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                      {data.statusText}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                      <span className="text-sm opacity-90">
                        {data.currentLabel}: {data.mainText}
                      </span>
                    </div>
                    <div className="text-xs opacity-75">
                      {data.nextLabel}: {data.nextText}
                    </div>
                  </div>
                  <div className="mt-4 bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: data.progress }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          case "tasks":
            return (
              <div
                key={card.key}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.bgClass} p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <CardIcon className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                      {data.statusText}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{card.title}</h3>
                  <div className="space-y-2">
                    {data.preview.length ? (
                      data.preview.map((item) => (
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
            );
          case "goal":
            return (
              <div
                key={card.key}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.bgClass} p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <CardIcon className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                      {data.statusText}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <div className="text-sm opacity-90 mb-2">
                    {/* Show total time spent */}
                    Total time spent: <span className="font-semibold">{data.totalTimeSpent}</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-yellow-300 to-orange-300 h-3 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${data.percent}%` }}
                    ></div>
                  </div>
                  <div className="text-xs opacity-75">
                    {/* Show number of modules left */}
                    Modules left: <span className="font-bold">{data.incompleteItems}</span>
                  </div>
                </div>
              </div>
            );
          case "rewards":
            return (
              <div
                key={card.key}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.bgClass} p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <CardIcon className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                      <Zap className="h-3 w-3" />
                      {data.statusText}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{data.totalPoints} Points</h3>
                  <div className="text-sm opacity-90 mb-4">Streak: {data.streak} days 🔥</div>
                  <div className="space-y-2">
                    <div className="text-xs opacity-75">
                      Next reward at {data.nextRewardAt} pts
                    </div>
                    <div className="bg-white/20 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ width: data.progress }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          case "reminders":
            return (
              <div
                key={card.key}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.bgClass} p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <CardIcon className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                      {data.statusText}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{card.title}</h3>
                  <div className="space-y-2">
                    {data.reminders.length ? (
                      data.reminders.map((r) => (
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
            );
          case "weekly":
            return (
              <div
                key={card.key}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.bgClass} p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <CardIcon className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                      {data.statusText}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <div className="text-sm opacity-90 mb-4">
                    {data.improving ? "You're improving! 🚀" : "Stay consistent!"}
                  </div>
                  <div className="flex items-end gap-1 h-12">
                    {data.bars.map((height, i) => (
                      <div
                        key={i}
                        className="bg-white/30 rounded-t flex-1 transition-all duration-500 hover:bg-white/50"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
