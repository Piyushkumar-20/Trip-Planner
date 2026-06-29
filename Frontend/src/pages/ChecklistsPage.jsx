import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardList,
  ListChecks,
  MoreHorizontal,
  NotebookText,
  Plus,
  Users,
} from "lucide-react";
import { useTrips } from "@/hooks/useTrips";
import { useTripSocket } from "@/hooks/useTripSocket";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const packingItems = [
  { id: "passport", title: "Passport", completed: true },
  { id: "wallet", title: "Wallet", completed: true },
  { id: "sunglasses", title: "Sunglasses", completed: true },
  { id: "camera", title: "Camera", completed: false },
  { id: "charger", title: "Charger", completed: false },
  { id: "medicines", title: "Medicines", completed: false },
  { id: "jacket", title: "Jacket", completed: false },
  { id: "adapter", title: "Travel Adapter", completed: false },
  { id: "flip-flops", title: "Flip Flops", completed: false },
];

const sharedItems = [
  { id: "hotel", title: "Book Hotel", completed: true, member: "Piyush", time: "2h ago", color: "bg-emerald-500" },
  { id: "cab", title: "Reserve Cab", completed: true, member: "Rahul", time: "5h ago", color: "bg-violet-500" },
  { id: "snacks", title: "Buy Snacks", completed: false, member: "Sneha", time: "1d ago", color: "bg-orange-500" },
  { id: "budget", title: "Create Budget", completed: false, member: "Piyush", time: "1d ago", color: "bg-emerald-500" },
  { id: "advance", title: "Pay Advance", completed: true, member: "Aman", time: "2d ago", color: "bg-blue-500" },
  { id: "itinerary", title: "Plan Day-wise Itinerary", completed: false, member: "Rahul", time: "2d ago", color: "bg-violet-500" },
];

const members = [
  { name: "Piyush", label: "You", color: "bg-emerald-500" },
  { name: "Rahul", color: "bg-violet-500" },
  { name: "Sneha", color: "bg-orange-500" },
  { name: "Aman", color: "bg-blue-500" },
];

const views = {
  packing: {
    title: "Packing List",
    description: "Personal checklist - only visible to you",
    icon: ClipboardList,
    action: "Add Item",
    addCopy: "Add new item",
    progressTitle: "Your Progress",
    progressLabel: "Packed",
    completeLabel: "Packed",
    pendingLabel: "Remaining",
    color: "text-primary",
    stroke: "stroke-primary",
    rows: packingItems,
  },
  shared: {
    title: "Shared Tasks",
    description: "Collaborative checklist for the whole trip",
    icon: Users,
    action: "Add Task",
    addCopy: "Add new task",
    progressTitle: "Overall Progress",
    progressLabel: "Completed",
    completeLabel: "Completed",
    pendingLabel: "Pending",
    color: "text-emerald-500",
    stroke: "stroke-emerald-500",
    rows: sharedItems,
  },
};

function StatusBox({ checked }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200",
        checked
          ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25"
          : "border-muted-foreground/40 bg-background group-hover/row:border-primary/70",
      )}
    >
      {checked && <Check className="size-3.5" />}
    </span>
  );
}

function Assignee({ item }) {
  if (!item.member) return null;

  return (
    <div className="hidden min-w-36 items-center gap-2 text-sm sm:flex">
      <Avatar className="size-6">
        <AvatarFallback className={cn("text-[11px] font-semibold text-white", item.color)}>
          {item.member[0]}
        </AvatarFallback>
      </Avatar>
      <span className="font-medium">{item.member}</span>
    </div>
  );
}

function ChecklistRow({ item, shared }) {
  return (
    <div className="group/row grid min-h-12 grid-cols-[1fr_auto] items-center gap-3 border-b px-4 transition-all duration-200 last:border-b-0 hover:bg-muted/45 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <StatusBox checked={item.completed} />
        <div className="min-w-0">
          <p className={cn("truncate text-sm font-medium", item.completed && "text-foreground")}>
            {item.title}
          </p>
          {shared && (
            <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground sm:hidden">
              <span>{item.member}</span>
              <span aria-hidden="true">/</span>
              <span>{item.time}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Assignee item={item} />
        {shared && <span className="hidden w-14 text-right text-xs text-muted-foreground sm:inline">{item.time}</span>}
        <Button variant="ghost" size="icon-sm" aria-label={`More options for ${item.title}`}>
          <MoreHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function ChecklistTable({ view }) {
  const shared = view.title === "Shared Tasks";

  return (
    <Card className="py-0 shadow-lg shadow-foreground/5">
      <CardContent className="p-0">
        <div className="divide-y-0">
          {view.rows.map((item) => (
            <ChecklistRow key={item.id} item={item} shared={shared} />
          ))}
        </div>
        <div className="p-2">
          <button className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/20 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/60 hover:bg-primary/5 hover:text-primary">
            <Plus className="size-4 text-primary" />
            {view.addCopy}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressRing({ completed, total, strokeClass }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const percent = total ? completed / total : 0;
  const offset = circumference * (1 - percent);

  return (
    <div className="relative mx-auto size-36">
      <svg className="size-36 -rotate-90" viewBox="0 0 112 112" aria-hidden="true">
        <circle cx="56" cy="56" r={radius} className="stroke-muted" strokeWidth="7" fill="none" />
        <circle
          cx="56"
          cy="56"
          r={radius}
          className={cn(strokeClass, "transition-all duration-500")}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tracking-tight">
          {completed} / {total}
        </span>
        <span className="mt-1 text-[11px] text-muted-foreground">{Math.round(percent * 100)}% {completed === total ? "Done" : "Complete"}</span>
      </div>
    </div>
  );
}

function MetricLine({ color, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="flex items-center gap-2">
        <span className={cn("size-2 rounded-full", color)} />
        <span>{label}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ProgressCard({ view }) {
  const completed = view.rows.filter((item) => item.completed).length;
  const total = view.rows.length;

  return (
    <Card className="shadow-lg shadow-foreground/5">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">{view.progressTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ProgressRing completed={completed} total={total} strokeClass={view.stroke} />
        <Separator className="my-5" />
        <div className="space-y-3">
          <MetricLine color={view.title === "Shared Tasks" ? "bg-emerald-500" : "bg-primary"} label={view.completeLabel} value={completed} />
          <MetricLine color="bg-muted-foreground/60" label={view.pendingLabel} value={total - completed} />
          {view.title === "Shared Tasks" && <MetricLine color="bg-muted-foreground/30" label="Total Tasks" value={total} />}
        </div>
      </CardContent>
    </Card>
  );
}

function NotesCard() {
  return (
    <Card className="shadow-lg shadow-foreground/5">
      <CardHeader className="flex flex-row items-center gap-2">
        <NotebookText className="size-4 text-muted-foreground" />
        <CardTitle className="text-sm font-semibold">Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">Add any personal notes for this trip.</p>
        <Button variant="outline" size="sm" className="mt-4 border-primary/40 text-primary hover:bg-primary/10 hover:text-primary">
          <Plus className="size-3.5" />
          Add Note
        </Button>
      </CardContent>
    </Card>
  );
}

function MembersCard() {
  return (
    <Card className="shadow-lg shadow-foreground/5">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Trip Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {members.map((member) => (
            <div key={member.name} className="min-w-0 text-center">
              <Avatar className="mx-auto size-8">
                <AvatarFallback className={cn("text-xs font-semibold text-white", member.color)}>
                  {member.name[0]}
                </AvatarFallback>
              </Avatar>
              <p className="mt-2 truncate text-xs font-medium">{member.name}</p>
              {member.label && <p className="truncate text-[11px] text-muted-foreground">({member.label})</p>}
            </div>
          ))}
        </div>
        <Button variant="link" size="sm" className="mt-5 h-auto p-0 text-primary">
          View all members
          <ArrowRight className="size-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}

function ViewSwitcher({ activeView, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl border bg-card p-1 shadow-sm sm:w-fit">
      {Object.entries(views).map(([key, view]) => {
        const Icon = view.icon;
        const active = activeView === key;

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
              active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {view.title}
          </button>
        );
      })}
    </div>
  );
}

export default function ChecklistsPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("packing");
  const { data: trips, isLoading } = useTrips();

  useTripSocket(tripId);

  const trip = useMemo(() => trips?.find((item) => item._id === tripId), [trips, tripId]);
  const view = views[activeView];
  const Icon = view.icon;

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-[520px] w-full rounded-[24px]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" size="sm" className="w-fit" onClick={() => navigate(tripId ? `/trips/${tripId}` : "/trips")}>
          <ArrowLeft className="size-4" />
          {trip?.title ?? "Trip"}
        </Button>
        <ViewSwitcher activeView={activeView} onChange={setActiveView} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border bg-card shadow-sm">
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{view.title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{view.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button className="border border-primary/20 shadow-sm shadow-primary/15">
                <Plus className="size-4" />
                {view.action}
              </Button>
              <Button variant="outline" size="icon" aria-label="Checklist options">
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
          </div>

          <ChecklistTable view={view} />
        </main>

        <aside className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
          <ProgressCard view={view} />
          {activeView === "packing" ? <NotesCard /> : <MembersCard />}
        </aside>
      </div>
    </div>
  );
}
