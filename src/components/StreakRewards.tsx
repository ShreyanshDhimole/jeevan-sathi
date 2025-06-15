
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Crown, Zap } from 'lucide-react';
import { StreakReward } from '@/types/routine';

interface StreakRewardsProps {
  isOpen: boolean;
  onClose: () => void;
  reward: StreakReward;
  onClaim: () => void;
}

export const StreakRewards = ({ isOpen, onClose, reward, onClaim }: StreakRewardsProps) => {
  const getRewardIcon = (streakDays: number) => {
    if (streakDays >= 30) return <Crown className="h-12 w-12 text-purple-500" />;
    if (streakDays >= 14) return <Trophy className="h-12 w-12 text-yellow-500" />;
    if (streakDays >= 7) return <Star className="h-12 w-12 text-blue-500" />;
    return <Zap className="h-12 w-12 text-green-500" />;
  };

  const getRewardColor = (streakDays: number) => {
    if (streakDays >= 30) return 'from-purple-500 to-pink-600';
    if (streakDays >= 14) return 'from-yellow-500 to-orange-600';
    if (streakDays >= 7) return 'from-blue-500 to-indigo-600';
    return 'from-green-500 to-teal-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className={`bg-gradient-to-r ${getRewardColor(reward.streakDays)} rounded-t-lg p-6 -m-6 mb-4 text-white text-center`}>
          <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            {getRewardIcon(reward.streakDays)}
          </div>
          <h2 className="text-2xl font-bold mb-2">🎉 Streak Milestone!</h2>
          <div className="text-lg font-semibold">{reward.streakDays} Day Streak</div>
        </div>
        
        <div className="space-y-4 text-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{reward.title}</h3>
            <p className="text-gray-600 mb-4">{reward.description}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-green-600">+{reward.bonusPoints}</div>
            <div className="text-sm text-green-700">Bonus Points Earned!</div>
          </div>

          <div className="pt-4">
            <Button onClick={onClaim} className="w-full" size="lg">
              <Trophy className="h-4 w-4 mr-2" />
              Claim Reward
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
