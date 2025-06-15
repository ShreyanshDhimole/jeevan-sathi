
import React, { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AlertTriangle, CheckCircle, Plus, Dice6 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AppSettings, defaultSettings, Punishment } from "@/types/settings";

const Punishments = () => {
  const [points, setPoints] = useState(1450);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [activePunishments, setActivePunishments] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRandomDialog, setShowRandomDialog] = useState(false);
  const [randomPoints, setRandomPoints] = useState(50);
  const [newPunishment, setNewPunishment] = useState({
    name: "",
    description: "",
    severity: "medium" as "light" | "medium" | "severe",
    cost: 100,
    icon: "⚡"
  });
  const { toast } = useToast();

  React.useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const acceptPunishment = (punishment: Punishment) => {
    if (points >= punishment.cost) {
      setPoints(prev => prev - punishment.cost);
      setActivePunishments(prev => [...prev, punishment.id]);
      
      toast({
        title: "Punishment Accepted 😤",
        description: `You accepted "${punishment.name}" and lost ${punishment.cost} points. Time to face the consequences!`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Not enough points! 😅",
        description: `You need ${punishment.cost - points} more points to accept this punishment.`,
        variant: "destructive",
      });
    }
  };

  const completePunishment = (punishment: Punishment) => {
    setActivePunishments(prev => prev.filter(id => id !== punishment.id));
    toast({
      title: "Punishment Completed! 💪",
      description: `Great job completing "${punishment.name}". You've learned from your mistakes!`,
    });
  };

  const createCustomPunishment = () => {
    if (newPunishment.name.trim()) {
      const customPunishment: Punishment = {
        id: Date.now().toString(),
        name: newPunishment.name,
        description: newPunishment.description,
        severity: newPunishment.severity,
        cost: newPunishment.cost,
        icon: newPunishment.icon
      };
      
      setSettings(prev => ({
        ...prev,
        punishments: {
          ...prev.punishments,
          availablePunishments: [...prev.punishments.availablePunishments, customPunishment]
        }
      }));
      
      setNewPunishment({
        name: "",
        description: "",
        severity: "medium",
        cost: 100,
        icon: "⚡"
      });
      setShowCreateDialog(false);
      
      toast({
        title: "Custom Punishment Created! ⚡",
        description: `"${customPunishment.name}" added to your punishments list.`,
      });
    }
  };

  const applyRandomPunishment = () => {
    if (points >= randomPoints) {
      setPoints(prev => prev - randomPoints);
      setShowRandomDialog(false);
      toast({
        title: "Random Punishment Applied! 🎲",
        description: `You lost ${randomPoints} points randomly. Sometimes life is unfair!`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Not enough points! 😅",
        description: `You need ${randomPoints - points} more points for this random punishment.`,
        variant: "destructive",
      });
    }
  };

  const availablePunishments = settings.punishments.availablePunishments.filter(
    p => !activePunishments.includes(p.id)
  );

  const pendingPunishments = settings.punishments.availablePunishments.filter(
    p => activePunishments.includes(p.id)
  );

  if (!settings.punishments.enablePunishments) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
          <AppSidebar />
          <main className="flex-1 flex flex-col items-stretch xl:px-8 px-4 pt-6 bg-transparent">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger />
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="text-lg font-semibold text-gray-800">Punishments</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-gray-100">
              <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Punishment System Disabled</h2>
              <p className="text-gray-600 mb-6">
                The punishment system is currently disabled. Enable it in Settings to start using consequences for missed tasks.
              </p>
              <Button onClick={() => window.location.href = '/settings'}>
                Go to Settings
              </Button>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-stretch xl:px-8 px-4 pt-6 bg-transparent">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-lg font-semibold text-gray-800">Punishments</span>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <Button onClick={() => setShowRandomDialog(true)} variant="outline" className="flex items-center gap-2">
                <Dice6 className="h-4 w-4" />
                Random Punishment
              </Button>
              <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Custom Punishment
              </Button>
              <div className="bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-bold">{points} pts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {pendingPunishments.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Punishments
                </h3>
                <div className="space-y-3">
                  {pendingPunishments.map((punishment) => (
                    <div key={punishment.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{punishment.icon}</div>
                        <div>
                          <span className="font-medium text-gray-900">{punishment.name}</span>
                          <div className="text-sm text-gray-600">{punishment.description}</div>
                          <div className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                            punishment.severity === 'severe' ? 'bg-red-100 text-red-700' :
                            punishment.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {punishment.severity}
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => completePunishment(punishment)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Available Punishments</h3>
              <p className="text-gray-600 mb-6">
                Accept a punishment to make up for missed tasks and maintain your discipline.
              </p>
              
              <div className="space-y-3">
                {availablePunishments.map((punishment) => (
                  <div key={punishment.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{punishment.icon}</div>
                      <div>
                        <span className="font-medium text-gray-900">{punishment.name}</span>
                        <div className="text-sm text-gray-600">{punishment.description}</div>
                        <div className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                          punishment.severity === 'severe' ? 'bg-red-100 text-red-700' :
                          punishment.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {punishment.severity}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-600">{punishment.cost} pts</span>
                      <Button 
                        onClick={() => acceptPunishment(punishment)}
                        variant="destructive"
                        disabled={points < punishment.cost}
                      >
                        {points >= punishment.cost ? 'Accept' : 'Not enough points'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {availablePunishments.length === 0 && (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No punishments available. Configure them in Settings.</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">💡 About Punishments</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Punishments help you stay accountable when you miss tasks</li>
                <li>• They cost points but help build discipline and consistency</li>
                <li>• You can customize punishment types and severity in Settings</li>
                <li>• Complete punishments to prove your commitment to improvement</li>
              </ul>
            </div>
          </div>

          {/* Create Custom Punishment Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Create Custom Punishment
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Punishment Name
                  </label>
                  <input
                    type="text"
                    value={newPunishment.name}
                    onChange={(e) => setNewPunishment(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., No dessert, extra exercise..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newPunishment.description}
                    onChange={(e) => setNewPunishment(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this punishment involves..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <select
                    value={newPunishment.severity}
                    onChange={(e) => setNewPunishment(prev => ({ ...prev, severity: e.target.value as "light" | "medium" | "severe" }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="medium">Medium</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Points Cost
                  </label>
                  <input
                    type="number"
                    value={newPunishment.cost}
                    onChange={(e) => setNewPunishment(prev => ({ ...prev, cost: Number(e.target.value) }))}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon (emoji)
                  </label>
                  <input
                    type="text"
                    value={newPunishment.icon}
                    onChange={(e) => setNewPunishment(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="⚡"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={createCustomPunishment} variant="destructive" className="flex-1">
                    Create Punishment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Random Punishment Dialog */}
          <Dialog open={showRandomDialog} onOpenChange={setShowRandomDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Dice6 className="h-5 w-5 text-purple-600" />
                  Random Punishment
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Sometimes you need to punish yourself randomly. Enter the number of points to lose.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Points to Lose
                  </label>
                  <input
                    type="number"
                    value={randomPoints}
                    onChange={(e) => setRandomPoints(Number(e.target.value))}
                    min="1"
                    max={points}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You currently have {points} points
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <p className="text-sm text-red-800">
                    ⚠️ This action cannot be undone. You will lose {randomPoints} points immediately.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowRandomDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={applyRandomPunishment} variant="destructive" className="flex-1">
                    Apply Random Punishment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Punishments;
