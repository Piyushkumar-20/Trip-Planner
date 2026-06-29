import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Users,
  Settings,
  PlaneTakeoff,
  LogOut,
  ChevronUp,
  ChevronRight,
  ListChecks,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/shared/ThemeToggle";

const topNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Trips", url: "/trips", icon: Map },
  { title: "Members", url: "/members", icon: Users },
];

const checklistSubItems = [
  { key: "personal", title: "Personal", icon: User },
  { key: "shared", title: "Shared", icon: Users },
];

function NavItem({ item }) {
  const { pathname } = useLocation();
  const isActive = pathname === item.url || pathname.startsWith(item.url + "/");

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <NavLink to={item.url}>
          <item.icon />
          <span>{item.title}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// Checklists are trip-scoped, but the sidebar is global. We follow the trip in
// the current route and remember the most recent one so the entry stays usable
// from anywhere in the app.
function ChecklistsNav() {
  const { pathname, search } = useLocation();
  const routeTripId = pathname.match(/^\/trips\/([^/]+)/)?.[1];

  // Remember the trip we're browsing so the checklist links stay usable from
  // anywhere in the app (the sidebar is global, checklists are trip-scoped).
  useEffect(() => {
    if (routeTripId) localStorage.setItem("activeTripId", routeTripId);
  }, [routeTripId]);

  const tripId = routeTripId ?? localStorage.getItem("activeTripId");
  const base = tripId ? `/trips/${tripId}/checklists` : "/trips";
  const onChecklists = /^\/trips\/[^/]+\/checklists/.test(pathname);
  const activeType = new URLSearchParams(search).get("type") === "shared" ? "shared" : "personal";

  const [open, setOpen] = useState(onChecklists);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={onChecklists}
        tooltip="Checklists"
        className="cursor-pointer"
        onClick={() => setOpen((value) => !value)}
      >
        <ListChecks />
        <span>Checklists</span>
        <ChevronRight
          className={cn("ml-auto transition-transform duration-200", open && "rotate-90")}
        />
      </SidebarMenuButton>
      {open && (
        <SidebarMenuSub>
          {checklistSubItems.map((item) => (
            <SidebarMenuSubItem key={item.key}>
              <SidebarMenuSubButton asChild isActive={onChecklists && activeType === item.key}>
                <NavLink to={`${base}?type=${item.key}`}>
                  <item.icon />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}

function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate("/");
    try {
      await logout();
    } catch {
      localStorage.removeItem("accessToken");
    }
  };

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2 cursor-default">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                  <PlaneTakeoff className="h-4 w-4" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-semibold text-sm">TripSync</span>
                  <span className="text-xs text-muted-foreground">Trip Planner</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {topNavItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
              <ChecklistsNav />
              <NavItem item={{ title: "Settings", url: "/settings", icon: Settings }} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="cursor-pointer">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-none min-w-0">
                    <span className="font-medium text-sm truncate">{user?.fullName}</span>
                    <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4 shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default function MainLayout() {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-muted-foreground">TripSync</span>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6">
            <Outlet />
          </div>
        </SidebarInset>
        <Toaster richColors position="top-right" />
      </SidebarProvider>
    </TooltipProvider>
  );
}
