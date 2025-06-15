
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Gift, Star, Crown } from "lucide-react";

const Rewards = () => {
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
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
              <div className="flex items-center gap-4">
                <Crown className="h-12 w-12" />
                <div>
                  <h2 className="text-2xl font-bold">1,450 Points</h2>
                  <p className="text-yellow-100">Your current balance</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Available Rewards</h3>
              <div className="grid gap-4">
                {[
                  { reward: "20 mins Instagram", cost: 100, available: true },
                  { reward: "Order Pizza", cost: 500, available: true },
                  { reward: "Movie Night", cost: 200, available: true },
                  { reward: "Shopping Spree", cost: 1000, available: true },
                  { reward: "Weekend Trip", cost: 2000, available: false },
                ].map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${
                    item.available ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Star className={`h-5 w-5 ${item.available ? 'text-yellow-500' : 'text-gray-400'}`} />
                      <span className={`font-medium ${item.available ? 'text-gray-900' : 'text-gray-500'}`}>
                        {item.reward}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-600">{item.cost} pts</span>
                      <button 
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          item.available 
                            ? 'bg-green-500 text-white hover:bg-green-600' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!item.available}
                      >
                        {item.available ? 'Claim' : 'Locked'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Rewards;
