
import React, { useState } from "react";
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
  Fingerprint
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// User Profile Sidebar Panel
function UserProfilePanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Placeholder: actual login not connected (needs backend)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    window.alert(`Login attempted for user: ${username}`);
  };
  const handleFingerprint = () => {
    window.alert("Fingerprint authentication not implemented in demo.");
  };

  return (
    <form onSubmit={handleLogin} className="px-4 py-3 flex flex-col gap-2">
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Enter username"
        autoComplete="username"
      />
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Enter password"
        autoComplete="current-password"
      />
      <Button type="submit" className="mt-1 w-full">Login</Button>
      <Button
        type="button"
        variant="outline"
        className="w-full flex gap-2 justify-center items-center"
        onClick={handleFingerprint}
      >
        <Fingerprint className="h-4 w-4" />
        <span>Sign in with fingerprint</span>
      </Button>
    </form>
  );
}

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
        {/* Avatar at the very top */}
        <div className="flex flex-col items-center py-4">
          <Avatar className="h-14 w-14 border-2 border-accent shadow-md mb-2">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div className="text-sm font-semibold">Welcome!</div>
        </div>
        
        {/* Profile Section */}
        <SidebarGroup>
          <SidebarGroupLabel>User Profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <UserProfilePanel />
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* App Navigation */}
        <SidebarSeparator />
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
