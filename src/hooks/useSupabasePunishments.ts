import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Punishment {
  id: string;
  title: string;
  description?: string;
  cost: number;
  category: string;
  timesApplied: number;
  createdAt: string;
  updatedAt: string;
}

export function useSupabasePunishments() {
  const [punishments, setPunishments] = useState<Punishment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPunishments();
  }, []);

  const loadPunishments = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('punishments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPunishments: Punishment[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        cost: item.cost,
        category: item.category,
        timesApplied: item.times_applied || 0,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      setPunishments(formattedPunishments);
    } catch (error) {
      console.error('Error loading punishments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPunishment = async (punishment: {
    title: string;
    description?: string;
    cost: number;
    category: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await (supabase as any)
        .from('punishments')
        .insert({
          user_id: user.id,
          title: punishment.title,
          description: punishment.description,
          cost: punishment.cost,
          category: punishment.category,
          times_applied: 0,
        })
        .select()
        .single();

      if (error) throw error;

      const formattedPunishment: Punishment = {
        id: data.id,
        title: data.title,
        description: data.description,
        cost: data.cost,
        category: data.category,
        timesApplied: data.times_applied,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setPunishments(prev => [formattedPunishment, ...prev]);
      return formattedPunishment;
    } catch (error) {
      console.error('Error adding punishment:', error);
      throw error;
    }
  };

  const applyPunishment = async (punishmentId: string) => {
    try {
      const punishment = punishments.find(p => p.id === punishmentId);
      if (!punishment) throw new Error('Punishment not found');

      const { error } = await (supabase as any)
        .from('punishments')
        .update({ times_applied: punishment.timesApplied + 1 })
        .eq('id', punishmentId);

      if (error) throw error;

      setPunishments(prev => prev.map(p => 
        p.id === punishmentId ? { ...p, timesApplied: p.timesApplied + 1 } : p
      ));

      return punishment;
    } catch (error) {
      console.error('Error applying punishment:', error);
      throw error;
    }
  };

  const deletePunishment = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('punishments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPunishments(prev => prev.filter(punishment => punishment.id !== id));
    } catch (error) {
      console.error('Error deleting punishment:', error);
      throw error;
    }
  };

  return {
    punishments,
    loading,
    addPunishment,
    applyPunishment,
    deletePunishment,
    loadPunishments,
  };
}