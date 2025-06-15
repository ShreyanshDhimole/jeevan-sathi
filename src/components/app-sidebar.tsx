
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Clock, CheckSquare, Target, Gift, TrendingUp, Sparkles } from "lucide-react";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    active: true,
  },
  {
    title: "Routine",
    url: "#",
    icon: Clock,
  },
  {
    title: "Tasks",
    url: "#",
    icon: CheckSquare,
  },
  {
    title: "Goals",
    url: "#",
    icon: Target,
  },
  {
    title: "Rewards",
    url: "#",
    icon: Gift,
  },
  {
    title: "Insights",
    url: "#",
    icon: TrendingUp,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-gray-200/50">
      <SidebarContent className="bg-gradient-to-b from-white to-gray-50/50">
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            Jeevan Sathi
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={item.active}
                    className="group relative rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-500 data-[active=true]:to-purple-600 data-[active=true]:text-white data-[active=true]:shadow-lg"
                  >
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                      {item.active && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200/50">
            <div className="text-xs text-gray-600 mb-1">Today's Progress</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-3/4"></div>
              </div>
              <span className="text-xs font-medium text-gray-700">75%</span>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
