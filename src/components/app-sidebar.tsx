import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
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
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
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
  );
}
