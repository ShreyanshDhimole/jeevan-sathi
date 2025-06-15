
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
  Home,
  Calendar,
  Clock,
  CheckSquare,
  List,
  Settings,
  BarChart,
  Target,
  Gift,
  AlertTriangle,
  Bell,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <SidebarGroup>
          <div className="flex flex-col items-center justify-center pt-6 pb-3">
            <Avatar className="h-14 w-14 border-2 border-accent shadow-lg">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div className="mt-2 text-base font-semibold">Welcome!</div>
          </div>
          <SidebarSeparator />
          <SidebarGroupLabel className="mt-1 mb-2 px-4 text-xs text-muted-foreground tracking-widest uppercase">
            Navigation
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
