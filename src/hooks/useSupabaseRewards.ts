import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Reward {
  id: string;
  title: string;
  description?: string;
  cost: number;
  category: string;
  timesClaimed: number;
  createdAt: string;
  updatedAt: string;
}

export function useSupabaseRewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('rewards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRewards: Reward[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        cost: item.cost,
        category: item.category,
        timesClaimed: item.times_claimed || 0,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      setRewards(formattedRewards);
    } catch (error) {
      console.error('Error loading rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const addReward = async (reward: {
    title: string;
    description?: string;
    cost: number;
    category: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await (supabase as any)
        .from('rewards')
        .insert({
          user_id: user.id,
          title: reward.title,
          description: reward.description,
          cost: reward.cost,
          category: reward.category,
          times_claimed: 0,
        })
        .select()
        .single();

      if (error) throw error;

      const formattedReward: Reward = {
        id: data.id,
        title: data.title,
        description: data.description,
        cost: data.cost,
        category: data.category,
        timesClaimed: data.times_claimed,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setRewards(prev => [formattedReward, ...prev]);
      return formattedReward;
    } catch (error) {
      console.error('Error adding reward:', error);
      throw error;
    }
  };

  const claimReward = async (rewardId: string) => {
    try {
      const reward = rewards.find(r => r.id === rewardId);
      if (!reward) throw new Error('Reward not found');

      const { error } = await (supabase as any)
        .from('rewards')
        .update({ times_claimed: reward.timesClaimed + 1 })
        .eq('id', rewardId);

      if (error) throw error;

      setRewards(prev => prev.map(r => 
        r.id === rewardId ? { ...r, timesClaimed: r.timesClaimed + 1 } : r
      ));

      return reward;
    } catch (error) {
      console.error('Error claiming reward:', error);
      throw error;
    }
  };

  const deleteReward = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('rewards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRewards(prev => prev.filter(reward => reward.id !== id));
    } catch (error) {
      console.error('Error deleting reward:', error);
      throw error;
    }
  };

  return {
    rewards,
    loading,
    addReward,
    claimReward,
    deleteReward,
    loadRewards,
  };
}