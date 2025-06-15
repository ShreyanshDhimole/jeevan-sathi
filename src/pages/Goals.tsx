
import React, { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Target, TrendingUp, Calendar, Plus, Edit, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Goal {
  id: string;
  title: string;
  progress: number;
  deadline: string;
  category: string;
  dailyTarget: string;
  status: 'on-track' | 'behind' | 'ahead';
}

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([
    { 
      id: '1',
      title: "Learn Python", 
      progress: 65, 
      deadline: "30 days", 
      category: "Learning",
      dailyTarget: "Study 1 hour daily",
      status: 'on-track'
    },
    { 
      id: '2',
      title: "Lose 5kg", 
      progress: 40, 
      deadline: "60 days", 
      category: "Health",
      dailyTarget: "Exercise 30 mins + healthy eating",
      status: 'behind'
    },
    { 
      id: '3',
      title: "Read 12 books", 
      progress: 75, 
      deadline: "365 days", 
      category: "Personal",
      dailyTarget: "Read 30 pages daily",
      status: 'ahead'
    },
    { 
      id: '4',
      title: "Save $5000", 
      progress: 25, 
      deadline: "180 days", 
      category: "Finance",
      dailyTarget: "Save $28 daily",
      status: 'behind'
    },
  ]);

  const updateProgress = (id: string, increment: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id 
        ? { ...goal, progress: Math.min(100, Math.max(0, goal.progress + increment)) }
        : goal
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'text-green-600';
      case 'behind': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getRecommendation = (goal: Goal) => {
    if (goal.status === 'behind') {
      const catchUpEffort = Math.ceil((100 - goal.progress) / parseInt(goal.deadline) * 1.5);
      return `⚡ You're behind! Increase effort by ${catchUpEffort}% to catch up.`;
    } else if (goal.status === 'ahead') {
      return `🎉 Great job! You're ahead of schedule. Keep the momentum!`;
    }
    return `✅ On track! Continue with your ${goal.dailyTarget}`;
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
              <Target className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-semibold text-gray-800">Goals</span>
            </div>
          </div>

          <div className="mb-6">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Goal
            </Button>
          </div>
          
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{goal.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {goal.deadline}
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {goal.category}
                      </span>
                      <span className={`font-medium ${getStatusColor(goal.status)}`}>
                        {goal.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getStatusColor(goal.status)}`}>
                      {goal.progress}%
                    </div>
                    <div className="flex items-center gap-1">
                      {goal.status === 'ahead' && <Trophy className="h-4 w-4 text-green-500" />}
                      <TrendingUp className={`h-4 w-4 ${getStatusColor(goal.status)}`} />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        goal.status === 'ahead' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                        goal.status === 'behind' ? 'bg-gradient-to-r from-red-500 to-orange-600' :
                        'bg-gradient-to-r from-blue-500 to-purple-600'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-1">Daily Target:</div>
                  <div className="text-sm text-gray-600 mb-2">{goal.dailyTarget}</div>
                  <div className={`text-sm p-2 rounded-lg ${
                    goal.status === 'ahead' ? 'bg-green-50 text-green-800' :
                    goal.status === 'behind' ? 'bg-red-50 text-red-800' :
                    'bg-blue-50 text-blue-800'
                  }`}>
                    {getRecommendation(goal)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateProgress(goal.id, -5)}
                    disabled={goal.progress <= 0}
                  >
                    -5%
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateProgress(goal.id, 5)}
                    disabled={goal.progress >= 100}
                  >
                    +5%
                  </Button>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Goals;
