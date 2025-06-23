
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Gift, Trophy, Star } from "lucide-react";
import { PointsButton } from "@/components/PointsButton";
import { getPoints, setPoints, subscribeToPointsChange } from "@/utils/pointsStorage";
import { AppSettings, defaultSettings } from "@/types/settings";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Rewards = () => {
  const [totalPoints, setTotalPoints] = React.useState(getPoints());
  const { toast } = useToast();

  // Get rewards settings from localStorage with proper initialization
  const [settings, setSettings] = React.useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('appSettings');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        // Ensure all required properties exist by merging with defaults
        const mergedSettings = {
          ...defaultSettings,
          ...parsedSettings,
          rewards: {
            ...defaultSettings.rewards,
            ...parsedSettings.rewards
          }
        };
        setSettings(mergedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Subscribe to points changes for cross-tab sync
  React.useEffect(() => {
    const unsubscribe = subscribeToPointsChange(setTotalPoints);
    return unsubscribe;
  }, []);

  const handleClaim = (rewardName: string, points: number) => {
    const newPoints = totalPoints + points;
    setPoints(newPoints);
    setTotalPoints(newPoints);
    
    toast({
      title: `${rewardName} Claimed! 🎉`,
      description: `You earned ${points} points! Total: ${newPoints}`,
    });
  };

  // Show loading state while settings are being loaded
  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-x-hidden">
          <AppSidebar />
          <main className="flex-1 flex flex-col w-full min-w-0 px-3 md:px-4 xl:px-8 pt-4 md:pt-6 bg-transparent">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-gray-500">Loading rewards...</div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

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
                <Gift className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold text-gray-800">Rewards</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <PointsButton points={totalPoints} />
            </div>
          </div>

          {/* Mobile-friendly content */}
          <div className="space-y-4 md:space-y-6 w-full min-w-0">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Available Rewards</h2>
              
              {/* Reward cards from settings - responsive grid */}
              {settings?.rewards?.availableRewards && settings.rewards.availableRewards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {settings.rewards.availableRewards.map((reward) => (
                    <div key={reward.id} className="p-4 md:p-6 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{reward.icon}</span>
                        <span className="font-semibold text-gray-800">{reward.name}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">{reward.description}</p>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          reward.category === 'streak' ? 'bg-blue-100 text-blue-700' :
                          reward.category === 'achievement' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {reward.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600">+{reward.points} pts</span>
                          <Button 
                            size="sm"
                            onClick={() => handleClaim(reward.name, reward.points)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Claim
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No rewards configured. Add rewards in Settings to see them here.
                </div>
              )}
            </div>

            {/* Progress section */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Current Streak</span>
                  <span className="text-sm text-gray-600">3 days</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Total Points</span>
                  <span className="text-sm text-gray-600">{totalPoints} pts</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Next Reward</span>
                  <span className="text-sm text-blue-600">Week Streak (4 days to go)</span>
                </div>  
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Rewards;
