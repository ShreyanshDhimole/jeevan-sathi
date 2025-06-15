
import React, { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Gift, Star, Crown, Trophy, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Rewards = () => {
  const [points, setPoints] = useState(1450);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newReward, setNewReward] = useState({ reward: "", cost: 100, icon: "🎁" });
  const { toast } = useToast();

  const [rewards, setRewards] = useState([
    { id: 1, reward: "20 mins Social Media", cost: 100, available: true, icon: "📱" },
    { id: 2, reward: "Order Favorite Snack", cost: 300, available: true, icon: "🍕" },
    { id: 3, reward: "Movie Night", cost: 500, available: true, icon: "🎬" },
    { id: 4, reward: "Shopping Spree", cost: 1000, available: true, icon: "🛍️" },
    { id: 5, reward: "Weekend Trip", cost: 2000, available: false, icon: "✈️" },
    { id: 6, reward: "Spa Day", cost: 1500, available: false, icon: "🧖‍♀️" },
  ]);

  const claimReward = (reward: typeof rewards[0]) => {
    if (points >= reward.cost) {
      setPoints(prev => prev - reward.cost);
      toast({
        title: "Reward Claimed! 🎉",
        description: `Enjoy your ${reward.reward}! You spent ${reward.cost} points.`,
      });
    } else {
      toast({
        title: "Not enough points 😅",
        description: `You need ${reward.cost - points} more points to claim this reward.`,
        variant: "destructive",
      });
    }
  };

  const createCustomReward = () => {
    if (newReward.reward.trim()) {
      const customReward = {
        id: rewards.length + 1,
        reward: newReward.reward,
        cost: newReward.cost,
        available: true,
        icon: newReward.icon
      };
      setRewards(prev => [...prev, customReward]);
      setNewReward({ reward: "", cost: 100, icon: "🎁" });
      setShowCreateDialog(false);
      toast({
        title: "Custom Reward Created! ✨",
        description: `"${customReward.reward}" added to your rewards list.`,
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-stretch xl:px-8 px-4 pt-6 bg-transparent">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-yellow-600" />
              <span className="text-lg font-semibold text-gray-800">Rewards</span>
            </div>
            <div className="ml-auto">
              <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Custom Reward
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Crown className="h-12 w-12" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{points} Points</h2>
                  <p className="text-yellow-100">Your current balance</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Available Rewards
              </h3>
              <div className="grid gap-4">
                {rewards.map((item) => (
                  <div key={item.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
                    points >= item.cost ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{item.icon}</div>
                      <div>
                        <span className={`font-medium ${points >= item.cost ? 'text-gray-900' : 'text-gray-500'}`}>
                          {item.reward}
                        </span>
                        <div className="text-sm text-gray-500">
                          {points >= item.cost ? 'Ready to claim!' : `Need ${item.cost - points} more points`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-600">{item.cost} pts</span>
                      <button 
                        onClick={() => claimReward(item)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          points >= item.cost
                            ? 'bg-green-500 text-white hover:bg-green-600' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={points < item.cost}
                      >
                        {points >= item.cost ? 'Claim' : 'Locked'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">💡 Earning Tips</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Complete high-priority tasks for more points</li>
                <li>• Maintain streaks for bonus rewards</li>
                <li>• 7-day streak = +50 points, 30-day streak = +200 points</li>
                <li>• Quality ratings of 4-5 stars give small bonuses</li>
              </ul>
            </div>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-yellow-600" />
                  Create Custom Reward
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reward Name
                  </label>
                  <input
                    type="text"
                    value={newReward.reward}
                    onChange={(e) => setNewReward(prev => ({ ...prev, reward: e.target.value }))}
                    placeholder="e.g., Extra gaming time, favorite meal..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Points Cost
                  </label>
                  <input
                    type="number"
                    value={newReward.cost}
                    onChange={(e) => setNewReward(prev => ({ ...prev, cost: Number(e.target.value) }))}
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
                    value={newReward.icon}
                    onChange={(e) => setNewReward(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="🎁"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={createCustomReward} className="flex-1">
                    Create Reward
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

export default Rewards;
