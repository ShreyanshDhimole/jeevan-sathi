
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AlertTriangle, Clock, Zap } from "lucide-react";
import { PointsButton } from "@/components/PointsButton";
import { getPoints, setPoints, subscribeToPointsChange } from "@/utils/pointsStorage";
import { AppSettings, defaultSettings } from "@/types/settings";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Punishments = () => {
  const [totalPoints, setTotalPoints] = React.useState(getPoints());
  const { toast } = useToast();
  
  // Get punishment settings from localStorage
  const [settings, setSettings] = React.useState<AppSettings>(defaultSettings);
  
  React.useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      const mergedSettings = {
        ...defaultSettings,
        ...parsedSettings,
        punishments: {
          ...defaultSettings.punishments,
          ...parsedSettings.punishments
        }
      };
      setSettings(mergedSettings);
    }
  }, []);

  // Subscribe to points changes for cross-tab sync
  React.useEffect(() => {
    const unsubscribe = subscribeToPointsChange(setTotalPoints);
    return unsubscribe;
  }, []);

  const handleClaim = (punishmentName: string, cost: number) => {
    const newPoints = Math.max(0, totalPoints - cost); // Don't go below 0
    setPoints(newPoints);
    setTotalPoints(newPoints);
    
    toast({
      title: `${punishmentName} Accepted! 💪`,
      description: `${cost} points deducted. Total: ${newPoints}`,
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-x-hidden">
        <AppSidebar />
        <main className="flex-1 flex flex-col w-full min-w-0 px-3 md:px-4 xl:px-8 pt-4 md:pt-6 bg-transparent">
          {/* Mobile-optimized header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 md:mb-6 w-full">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <SidebarTrigger />
              <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-lg font-semibold text-gray-800">Punishments</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <PointsButton points={totalPoints} />
            </div>
          </div>

          {/* Mobile-friendly content */}
          <div className="space-y-4 md:space-y-6 w-full min-w-0">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Active Penalties</h2>
              
              {/* Penalty cards - responsive layout */}
              <div className="space-y-4">
                <div className="p-4 md:p-6 rounded-lg border border-red-200 bg-red-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-red-600" />
                      <div>
                        <span className="font-semibold text-red-800">Missed Morning Routine</span>
                        <p className="text-sm text-red-700">Task skipped at 7:00 AM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-red-600">-25 pts</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-6 rounded-lg border border-orange-200 bg-orange-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-orange-600" />
                      <div>
                        <span className="font-semibold text-orange-800">Social Media Overuse</span>
                        <p className="text-sm text-orange-700">Exceeded 30-min daily limit</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-orange-600">-10 pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Punishments from Settings */}
            {settings.punishments.availablePunishments.length > 0 && (
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Punishments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {settings.punishments.availablePunishments.map((punishment) => (
                    <div key={punishment.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{punishment.icon}</span>
                        <span className="font-semibold text-gray-800">{punishment.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{punishment.description}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          punishment.severity === 'severe' ? 'bg-red-100 text-red-700' :
                          punishment.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {punishment.severity}
                        </span>
                        <span className="text-sm font-bold text-gray-700">{punishment.cost} pts</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleClaim(punishment.name, punishment.cost)}
                        className="w-full"
                      >
                        Accept Punishment
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Punishment rules section */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Penalty Rules</h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">Missed Task</span>
                  <span className="text-sm text-red-600">-{settings.punishments.missedTaskPenalty} points</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">Broken Streak</span>
                  <span className="text-sm text-red-600">-{settings.punishments.streakBreakPenalty} points</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">App Time Exceeded</span>
                  <span className="text-sm text-red-600">-10 points per hour</span>
                </div>
              </div>
            </div>

            {/* Stats section */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week's Impact</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-3 md:p-4 rounded-lg bg-red-50">
                  <div className="text-xl md:text-2xl font-bold text-red-600">3</div>
                  <div className="text-xs text-red-700">Missed Tasks</div>
                </div>
                <div className="text-center p-3 md:p-4 rounded-lg bg-orange-50">
                  <div className="text-xl md:text-2xl font-bold text-orange-600">2</div>
                  <div className="text-xs text-orange-700">App Violations</div>
                </div>
                <div className="text-center p-3 md:p-4 rounded-lg bg-gray-50 col-span-2 md:col-span-1">
                  <div className="text-xl md:text-2xl font-bold text-gray-600">-95</div>
                  <div className="text-xs text-gray-700">Total Points Lost</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Punishments;
