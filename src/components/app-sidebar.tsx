import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { 
  Home, Clock, CheckSquare, Target, Gift, 
  AlertTriangle, BarChart, Bell, Settings, 
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// The user profile panel and its related code have been completely removed.

export function AppSidebar() {
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Daily Routine", url: "/routine", icon: Clock },
    { title: "Tasks", url: "/tasks", icon: CheckSquare },
    { title: "Goals", url: "/goals", icon: Target },
    { title: "Rewards", url: "/rewards", icon: Gift },
    { title: "Punishments", url: "/punishments", icon: AlertTriangle },
    { title: "Insights", url: "/insights", icon: BarChart },
    { title: "Reminders & Notes", url: "/reminders-notes", icon: Bell },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        {/* Avatar at the very top left */}
        <div className="flex flex-col items-center py-4">
          <Avatar className="h-14 w-14 border-2 border-accent shadow-md mb-2 self-start ml-2">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </div>
        
        {/* App Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="mt-1 mb-2 px-4 text-xs text-muted-foreground tracking-widest uppercase">
            Jeevan Sathi
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
