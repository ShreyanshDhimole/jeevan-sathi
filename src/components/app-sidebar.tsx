
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
import { MessageSquare, Check, Clock, CalendarPlus, ArrowUp, ArrowDown } from "lucide-react";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: MessageSquare,
  },
  {
    title: "Routine",
    url: "#",
    icon: Clock,
  },
  {
    title: "Tasks",
    url: "#",
    icon: Check,
  },
  {
    title: "Goals",
    url: "#",
    icon: ArrowUp,
  },
  {
    title: "Rewards",
    url: "#",
    icon: CalendarPlus,
  },
  {
    title: "Insights",
    url: "#",
    icon: ArrowDown,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Jeevan Sathi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent transition-colors"
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.title}</span>
                    </a>
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
