import { format } from "date-fns";
import { CalendarDays, Users, Pencil, Trash2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function getTripStatus(trip) {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  if (now < start) return { label: "Upcoming", variant: "secondary" };
  if (now > end) return { label: "Completed", variant: "outline" };
  return { label: "Active", variant: "default" };
}

export default function TripCard({ trip, memberCount = 0, onEdit, onDelete }) {
  const navigate = useNavigate();
  const status = getTripStatus(trip);

  return (
    <Card className="group flex flex-col transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight line-clamp-1">{trip.title}</h3>
          <Badge variant={status.variant} className="shrink-0 text-xs">
            {status.label}
          </Badge>
        </div>
        {trip.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {trip.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-2 pb-3">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          <span>
            {format(new Date(trip.startDate), "MMM d")} –{" "}
            {format(new Date(trip.endDate), "MMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5 shrink-0" />
          <span>
            {memberCount} member{memberCount !== 1 ? "s" : ""}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onEdit(trip)}
          title="Edit trip"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          onClick={() => onDelete(trip)}
          title="Delete trip"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8 gap-1"
          onClick={() => navigate(`/trips/${trip._id}`, { state: { trip } })}
        >
          Open <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
