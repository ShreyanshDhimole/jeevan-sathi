
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
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
  Clock,
  CheckSquare,
  Target,
  Gift,
  AlertTriangle,
  BarChart,
  Bell,
  Settings,
  Navigation,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
    <div className="h-full">
      {/* Menu Button as the SheetTrigger */}
      <div className="flex items-center justify-start px-4 py-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="default" className="gap-2">
              <Navigation className="w-5 h-5" />
              <span className="font-medium text-base">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="px-6 pb-4 pt-6">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Navigate through your productivity tools.
              </SheetDescription>
            </SheetHeader>
            <Separator />
            <div className="flex flex-col gap-2 py-4">
              {menuItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground"
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* Avatar is just a static display */}
      <div className="flex flex-col items-center justify-center pt-4 pb-2">
        <Avatar className="h-14 w-14 border-2 border-accent shadow-lg">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <div className="mt-2 text-base font-semibold">Welcome!</div>
      </div>
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              {/* This avatar/header is just display for desktop sidebar */}
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
      </div>
    </div>
  );
}

