import { differenceInDays, format } from "date-fns";
import {
  CalendarDays,
  Clock,
  FileText,
  MapPin,
  Pencil,
  Receipt,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function getTripStatus(trip) {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  if (now < start) return { label: "Upcoming", variant: "secondary" };
  if (now > end) return { label: "Completed", variant: "outline" };
  return { label: "Active", variant: "default" };
}

function MetaItem({ icon: Icon, label }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="h-4 w-4 shrink-0 text-primary/70" />
      {label}
    </span>
  );
}

function Dot() {
  return (
    <span className="text-muted-foreground/30 select-none" aria-hidden>
      •
    </span>
  );
}

export default function TripCard({
  trip,
  memberCount = 0,
  destinationCount = 0,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
}) {
  const navigate = useNavigate();
  const status = getTripStatus(trip);

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const days = Math.max(differenceInDays(endDate, startDate), 1);
  const dateLabel = `${format(startDate, "MMM d")} – ${format(endDate, "MMM d, yyyy")}`;
  const ownerName = trip.owner?.fullName ?? trip.owner?.name ?? "—";

  return (
    <div
      className="group flex rounded-2xl border bg-card transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer overflow-hidden"
      onClick={() => navigate(`/trips/${trip._id}`, { state: { trip } })}
    >
      {/* Cover image */}
      <div className="shrink-0 w-52 h-52 sm:w-60 sm:h-60 relative overflow-hidden">
        {trip.coverImage ? (
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-primary/20 via-primary/10 to-muted flex items-center justify-center">
            <MapPin className="h-12 w-12 text-primary/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-6 min-w-0">
        {/* Top: title + badge */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-bold leading-tight line-clamp-1">
            {trip.title}
          </h3>
          <Badge
            variant={status.variant}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-sm"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            {status.label}
          </Badge>
        </div>

        {/* Description */}
        {trip.description && (
          <p className="mt-3 text-muted-foreground line-clamp-3 text-base leading-relaxed">
            {trip.description}
          </p>
        )}

        <div className="mt-4 space-y-3">
          <Separator />

          {/* Meta row + actions */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <MetaItem icon={CalendarDays} label={dateLabel} />
            <Dot />
            <MetaItem icon={Clock} label={`${days} day${days !== 1 ? "s" : ""}`} />
            <Dot />
            <MetaItem icon={User} label={ownerName} />
            <Dot />
            <MetaItem icon={Users} label={`${memberCount} member${memberCount !== 1 ? "s" : ""}`} />
            {destinationCount > 0 && (
              <>
                <Dot />
                <MetaItem icon={MapPin} label={`${destinationCount} destination${destinationCount !== 1 ? "s" : ""}`} />
              </>
            )}

            {/* Action buttons */}
            {(canEdit || canDelete) && (
              <div
                className="ml-auto flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onEdit(trip)}
                    title="Edit trip"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => onDelete(trip)}
                    title="Delete trip"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Quick-access tab buttons */}
          <div
            className="flex items-center gap-1 flex-wrap"
            onClick={(e) => e.stopPropagation()}
          >
            {[
              { label: "Members", icon: Users, tab: "members" },
              { label: "Destinations", icon: MapPin, tab: "destinations" },
              { label: "Expenses", icon: Receipt, tab: "expenses" },
              { label: "Documents", icon: FileText, tab: "documents" },
            ].map(({ label, icon: Icon, tab }) => (
              <button
                key={tab}
                onClick={() =>
                  navigate(`/trips/${trip._id}`, { state: { trip, activeTab: tab } })
                }
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Icon className="h-3 w-3" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
