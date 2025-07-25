import React, { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AppSettings, defaultSettings, Punishment, Reward } from "@/types/settings";
import { Input } from "@/components/ui/input";

// Capacitor/simulated ScreenTimePlugin bridge
const ScreenTimePlugin = (window as any).ScreenTimePlugin ?? {
  // Fallbacks for dev environment (mock, so UI works in browser)
  getScreenTimeLimits: async () => ({}),
  setScreenTimeLimit: async ({ app, minutes }: { app: string; minutes: number }) => {},
  getAppUsageStats: async ({ date }: { date: string }) => ({ apps: [] }),
};

// Helper for today date in YYYY-MM-DD
const todayStr = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const Settings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const { toast } = useToast();

  const updateSettings = (section: keyof AppSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const addCustomPunishment = () => {
    const newPunishment: Punishment = {
      id: Date.now().toString(),
      name: 'Custom Punishment',
      description: 'Describe your punishment',
      severity: 'medium',
      cost: 100,
      icon: '⚡'
    };
    
    setSettings(prev => ({
      ...prev,
      punishments: {
        ...prev.punishments,
        availablePunishments: [...prev.punishments.availablePunishments, newPunishment]
      }
    }));
  };

  const addCustomReward = () => {
    const newReward: Reward = {
      id: Date.now().toString(),
      name: 'Custom Reward',
      description: 'Describe your reward',
      category: 'achievement',
      points: 100,
      icon: '🎉'
    };
    
    setSettings(prev => ({
      ...prev,
      rewards: {
        ...prev.rewards,
        availableRewards: [...prev.rewards.availableRewards, newReward]
      }
    }));
  };

  const updatePunishment = (id: string, updates: Partial<Punishment>) => {
    setSettings(prev => ({
      ...prev,
      punishments: {
        ...prev.punishments,
        availablePunishments: prev.punishments.availablePunishments.map(p => 
          p.id === id ? { ...p, ...updates } : p
        )
      }
    }));
  };

  const updateReward = (id: string, updates: Partial<Reward>) => {
    setSettings(prev => ({
      ...prev,
      rewards: {
        ...prev.rewards,
        availableRewards: prev.rewards.availableRewards.map(r => 
          r.id === id ? { ...r, ...updates } : r
        )
      }
    }));
  };

  const deletePunishment = (id: string) => {
    setSettings(prev => ({
      ...prev,
      punishments: {
        ...prev.punishments,
        availablePunishments: prev.punishments.availablePunishments.filter(p => p.id !== id)
      }
    }));
  };

  const deleteReward = (id: string) => {
    setSettings(prev => ({
      ...prev,
      rewards: {
        ...prev.rewards,
        availableRewards: prev.rewards.availableRewards.filter(r => r.id !== id)
      }
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved! ✅",
      description: "Your preferences have been updated successfully.",
    });
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        // Ensure all required properties exist by merging with defaults
        const mergedSettings = {
          ...defaultSettings,
          ...parsedSettings,
          rewards: {
            ...defaultSettings.rewards,
            ...parsedSettings.rewards
          },
          punishments: {
            ...defaultSettings.punishments,
            ...parsedSettings.punishments
          }
        };
        setSettings(mergedSettings);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
        setSettings(defaultSettings);
      }
    }
  }, []);

  const [appLimits, setAppLimits] = useState<{ [app: string]: number }>({});
  const [usageStats, setUsageStats] = useState<{ [pkg: string]: number }>({});
  const [loadingAppLimits, setLoadingAppLimits] = useState(false);
  const [newLimit, setNewLimit] = useState({ app: "", minutes: 15 });

  // Load app limits and usage stats when entering tab
  const fetchLimitsAndUsage = async () => {
    setLoadingAppLimits(true);
    try {
      const limitsData = await ScreenTimePlugin.getScreenTimeLimits();
      setAppLimits(limitsData || {});
    } catch {
      setAppLimits({});
    }
    try {
      const stats = await ScreenTimePlugin.getAppUsageStats({ date: todayStr() });
      const usage: { [pkg: string]: number } = {};
      if (stats && Array.isArray(stats.apps)) {
        stats.apps.forEach((app: { package: string, minutes: number }) => {
          usage[app.package] = app.minutes;
        });
      }
      setUsageStats(usage);
    } catch {
      setUsageStats({});
    }
    setLoadingAppLimits(false);
  };

  // Only load on first render of tab
  const [hasLoadedPenalties, setHasLoadedPenalties] = useState(false);

  // Used for controlled switching tabs to perform fetching only when entering penalties tab:
  const [visibleTab, setVisibleTab] = useState<string>("reminders");

  React.useEffect(() => {
    if (visibleTab === "penalties" && !hasLoadedPenalties) {
      fetchLimitsAndUsage();
      setHasLoadedPenalties(true);
    }
  }, [visibleTab, hasLoadedPenalties]);

  // Add, update, remove app limits
  const handleUpdateLimit = async (app: string, minutes: number) => {
    await ScreenTimePlugin.setScreenTimeLimit({ app, minutes });
    fetchLimitsAndUsage();
  };
  const handleDeleteLimit = async (app: string) => {
    await ScreenTimePlugin.setScreenTimeLimit({ app, minutes: 0 }); // 0 = remove
    fetchLimitsAndUsage();
  };
  const handleAddLimit = async () => {
    if (!newLimit.app || newLimit.minutes <= 0) return;
    await ScreenTimePlugin.setScreenTimeLimit(newLimit);
    setNewLimit({ app: "", minutes: 15 });
    fetchLimitsAndUsage();
  };

  // Safety check to ensure settings are properly initialized
  if (!settings || !settings.rewards || !settings.punishments) {
    return <div>Loading settings...</div>;
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
                <SettingsIcon className="h-5 w-5 text-gray-600" />
                <span className="text-lg font-semibold text-gray-800">Settings</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button onClick={saveSettings} className="flex items-center gap-2 w-full sm:w-auto">
                <Save className="h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-full min-w-0">
            <Tabs value={visibleTab} onValueChange={(tab) => setVisibleTab(tab)} className="p-3 md:p-6">
              {/* Mobile-optimized tab list */}
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1 h-auto p-1">
                <TabsTrigger value="reminders" className="text-xs md:text-sm py-2 px-1">
                  Reminders
                </TabsTrigger>
                <TabsTrigger value="rewards" className="text-xs md:text-sm py-2 px-1">
                  Rewards
                </TabsTrigger>
                <TabsTrigger value="punishments" className="text-xs md:text-sm py-2 px-1">
                  Punishments
                </TabsTrigger>
                <TabsTrigger value="points" className="text-xs md:text-sm py-2 px-1">
                  Points
                </TabsTrigger>
                <TabsTrigger value="penalties" className="text-xs md:text-sm py-2 px-1">
                  App Penalties
                </TabsTrigger>
                <TabsTrigger value="streaks" className="text-xs md:text-sm py-2 px-1">
                  Streaks
                </TabsTrigger>
              </TabsList>

              <TabsContent value="reminders" className="space-y-6 mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Reminder Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Enable Reminders</label>
                      <p className="text-xs text-gray-500">Get notifications for upcoming tasks</p>
                    </div>
                    <Switch 
                      checked={settings.reminders?.enableReminders || false}
                      onCheckedChange={(checked) => updateSettings('reminders', 'enableReminders', checked)}
                    />
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">Pre-task reminder (minutes before)</label>
                      <input 
                        type="number" 
                        value={settings.reminders?.preTaskMinutes || 15}
                        onChange={(e) => updateSettings('reminders', 'preTaskMinutes', parseInt(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Overdue reminder (minutes after missed)</label>
                      <input 
                        type="number" 
                        value={settings.reminders?.overdueMinutes || 30}
                        onChange={(e) => updateSettings('reminders', 'overdueMinutes', parseInt(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Motivational nudge (minutes into task)</label>
                      <input 
                        type="number" 
                        value={settings.reminders?.motivationalNudgeMinutes || 10}
                        onChange={(e) => updateSettings('reminders', 'motivationalNudgeMinutes', parseInt(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* NEW Rewards Tab */}
              <TabsContent value="rewards" className="space-y-6 mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Rewards System</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Enable Rewards</label>
                      <p className="text-xs text-gray-500">Allow users to claim rewards for achievements</p>
                    </div>
                    <Switch 
                      checked={settings.rewards?.enableRewards || false}
                      onCheckedChange={(checked) => updateSettings('rewards', 'enableRewards', checked)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Available Rewards</h4>
                      <Button onClick={addCustomReward} size="sm">Add Custom</Button>
                    </div>
                    
                    {settings.rewards?.availableRewards?.map((reward) => (
                      <div key={reward.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <input 
                            type="text" 
                            value={reward.name}
                            onChange={(e) => updateReward(reward.id, { name: e.target.value })}
                            className="font-medium bg-transparent border-none p-0 text-sm"
                          />
                          <Button 
                            onClick={() => deleteReward(reward.id)}
                            variant="destructive" 
                            size="sm"
                          >
                            Delete
                          </Button>
                        </div>
                        <Textarea 
                          value={reward.description}
                          onChange={(e) => updateReward(reward.id, { description: e.target.value })}
                          placeholder="Describe the reward"
                          className="text-sm"
                        />
                        <div className="flex gap-2">
                          <select 
                            value={reward.category}
                            onChange={(e) => updateReward(reward.id, { category: e.target.value as any })}
                            className="px-2 py-1 border rounded text-sm"
                          >
                            <option value="streak">Streak</option>
                            <option value="achievement">Achievement</option>
                            <option value="bonus">Bonus</option>
                          </select>
                          <input 
                            type="number" 
                            value={reward.points}
                            onChange={(e) => updateReward(reward.id, { points: parseInt(e.target.value) })}
                            placeholder="Points value"
                            className="px-2 py-1 border rounded text-sm w-20"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="punishments" className="space-y-6 mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Punishment System</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Enable Punishments</label>
                      <p className="text-xs text-gray-500">Apply consequences for missed tasks</p>
                    </div>
                    <Switch 
                      checked={settings.punishments?.enablePunishments || false}
                      onCheckedChange={(checked) => updateSettings('punishments', 'enablePunishments', checked)}
                    />
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">Missed task penalty (points)</label>
                      <input 
                        type="number" 
                        value={settings.punishments?.missedTaskPenalty || 10}
                        onChange={(e) => updateSettings('punishments', 'missedTaskPenalty', parseInt(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Streak break penalty (points)</label>
                      <input 
                        type="number" 
                        value={settings.punishments?.streakBreakPenalty || 25}
                        onChange={(e) => updateSettings('punishments', 'streakBreakPenalty', parseInt(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Available Punishments</h4>
                      <Button onClick={addCustomPunishment} size="sm">Add Custom</Button>
                    </div>
                    
                    {settings.punishments?.availablePunishments?.map((punishment) => (
                      <div key={punishment.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <input 
                            type="text" 
                            value={punishment.name}
                            onChange={(e) => updatePunishment(punishment.id, { name: e.target.value })}
                            className="font-medium bg-transparent border-none p-0 text-sm"
                          />
                          <Button 
                            onClick={() => deletePunishment(punishment.id)}
                            variant="destructive" 
                            size="sm"
                          >
                            Delete
                          </Button>
                        </div>
                        <Textarea 
                          value={punishment.description}
                          onChange={(e) => updatePunishment(punishment.id, { description: e.target.value })}
                          placeholder="Describe the punishment"
                          className="text-sm"
                        />
                        <div className="flex gap-2">
                          <select 
                            value={punishment.severity}
                            onChange={(e) => updatePunishment(punishment.id, { severity: e.target.value as any })}
                            className="px-2 py-1 border rounded text-sm"
                          >
                            <option value="light">Light</option>
                            <option value="medium">Medium</option>
                            <option value="severe">Severe</option>
                          </select>
                          <input 
                            type="number" 
                            value={punishment.cost}
                            onChange={(e) => updatePunishment(punishment.id, { cost: parseInt(e.target.value) })}
                            placeholder="Points cost"
                            className="px-2 py-1 border rounded text-sm w-20"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="points" className="space-y-6 mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Points System</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Deduct points for missed tasks</label>
                      <p className="text-xs text-gray-500">Remove task points when you miss them</p>
                    </div>
                    <Switch 
                      checked={settings.points?.missedTaskPenalty || false}
                      onCheckedChange={(checked) => updateSettings('points', 'missedTaskPenalty', checked)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Quality bonus multiplier</label>
                    <p className="text-xs text-gray-500">Extra points for high-quality completions</p>
                    <input 
                      type="number" 
                      step="0.1"
                      value={settings.points?.qualityBonusMultiplier || 0.2}
                      onChange={(e) => updateSettings('points', 'qualityBonusMultiplier', parseFloat(e.target.value))}
                      className="w-full mt-1 px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* NEW App Penalties Tab */}
              <TabsContent value="penalties" className="space-y-6 mt-4">
                <div>
                  <h3 className="text-lg font-semibold">App Time Limits & Penalties</h3>
                  <p className="text-gray-500 mb-4 text-sm">
                    Control per-app daily time limits. When you exceed a limit, the app issues a penalty automatically. Edits here sync directly with your device.
                  </p>
                  <Button onClick={fetchLimitsAndUsage} size="sm" className="mb-2">Refresh Data</Button>
                  {loadingAppLimits ? (
                    <div className="text-center py-8 text-gray-500">Loading app limits…</div>
                  ) : (
                    <div className="space-y-4">
                      {Object.keys(appLimits).length === 0 && (
                        <div className="text-sm text-gray-600 italic py-4">No app time limits set yet.</div>
                      )}
                      {Object.entries(appLimits).map(([app, minutes]) => (
                        <div key={app} className="p-4 rounded border flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 bg-zinc-50">
                          <div className="flex-1">
                            <div className="font-mono pb-1">{app}</div>
                            <div className="text-xs text-gray-600">
                              Today's usage:{" "}
                              <span className={(usageStats[app] ?? 0) > minutes ? "text-red-600 font-bold" : "text-green-800"}>
                                {usageStats[app] ?? 0} / {minutes} min
                              </span>
                              {(usageStats[app] ?? 0) > minutes && (
                                <span className="ml-2 text-xs text-red-500">
                                  (+{(usageStats[app] ?? 0) - minutes} over)
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <Input
                              type="number"
                              min={1}
                              value={minutes}
                              onChange={e =>
                                handleUpdateLimit(app, Math.max(1, parseInt(e.target.value) || 1))
                              }
                              className="w-24"
                            />
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteLimit(app)}
                              size="sm"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                      {/* Add new app limit */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Input
                          placeholder="App package name"
                          value={newLimit.app}
                          onChange={e => setNewLimit(l => ({ ...l, app: e.target.value }))}
                          className="sm:max-w-xs"
                        />
                        <Input
                          type="number"
                          min={1}
                          placeholder="Daily minutes"
                          value={newLimit.minutes}
                          onChange={e => setNewLimit(l => ({ ...l, minutes: Math.max(1, +e.target.value) }))}
                          className="sm:w-28"
                        />
                        <Button
                          onClick={handleAddLimit}
                          size="sm"
                          className="shrink-0"
                          disabled={!newLimit.app || newLimit.minutes < 1}
                        >
                          Add App Limit
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="bg-blue-50 border-l-4 border-blue-400 px-4 py-3 rounded mt-6 text-blue-800 text-sm">
                    <div>
                      You may need to grant usage stats permission on your phone for this feature to work.<br />
                      The penalty system applies automatically if you exceed your set limits.
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="streaks" className="space-y-6 mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Streak Rewards</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Enable Streak Rewards</label>
                      <p className="text-xs text-gray-500">Get bonus points for maintaining streaks</p>
                    </div>
                    <Switch 
                      checked={settings.streaks?.enableStreakRewards || false}
                      onCheckedChange={(checked) => updateSettings('streaks', 'enableStreakRewards', checked)}
                    />
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">7-day streak bonus points</label>
                      <input 
                        type="number" 
                        value={settings.streaks?.weekReward || 50}
                        onChange={(e) => updateSettings('streaks', 'weekReward', parseInt(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">14-day streak bonus points</label>
                      <input 
                        type="number" 
                        value={settings.streaks?.biWeekReward || 100}
                        onChange={(e) => updateSettings('streaks', 'biWeekReward', parseInt(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">30-day streak bonus points</label>
                      <input 
                        type="number" 
                        value={settings.streaks?.monthReward || 200}
                        onChange={(e) => updateSettings('streaks', 'monthReward', parseInt(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
