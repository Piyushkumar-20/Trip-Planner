import { useState, useMemo } from "react";
import { Map, PlusCircle, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTrips } from "@/hooks/useTrips";
import { useMembers } from "@/hooks/useMembers";
import { can } from "@/lib/rbac";
import TripCard from "@/components/trips/TripCard";
import TripFormDialog from "@/components/trips/TripFormDialog";
import DeleteTripDialog from "@/components/trips/DeleteTripDialog";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

function TripCardWithMembers({ trip, onEdit, onDelete }) {
  const { user } = useAuth();
  const { data: members } = useMembers(trip._id);

  const userId = user?._id?.toString() ?? user?.id?.toString();
  const isOwner = trip.owner?.toString() === userId;
  const memberRecord = members?.find(
    (m) => m.userId?._id?.toString() === userId,
  );
  const currentRole = isOwner ? "Owner" : memberRecord?.role;

  return (
    <TripCard
      trip={trip}
      memberCount={members?.length ?? 0}
      onEdit={onEdit}
      onDelete={onDelete}
      canEdit={can(currentRole, "editTrip")}
      canDelete={can(currentRole, "deleteTrip")}
    />
  );
}

export default function TripsPage() {
  const { data: allTrips, isLoading } = useTrips();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTrip, setEditTrip] = useState(null);
  const [deleteTrip, setDeleteTrip] = useState(null);

  const trips = useMemo(() => {
    if (!search.trim()) return allTrips ?? [];
    return (allTrips ?? []).filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [allTrips, search]);

  return (
    <div>
      <PageHeader
        title="My Trips"
        description="Manage and organise all your travel plans."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Trip
          </Button>
        }
      />

      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search trips..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <EmptyState
          icon={Map}
          title={search ? "No trips found" : "No trips yet"}
          description={
            search
              ? "Try a different search term."
              : "Create your first trip to start planning your adventures."
          }
          action={
            !search && (
              <Button onClick={() => setCreateOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Trip
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCardWithMembers
              key={trip._id}
              trip={trip}
              onEdit={setEditTrip}
              onDelete={setDeleteTrip}
            />
          ))}
        </div>
      )}

      <TripFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        trip={null}
      />

      <TripFormDialog
        open={!!editTrip}
        onClose={() => setEditTrip(null)}
        trip={editTrip}
      />

      <DeleteTripDialog
        open={!!deleteTrip}
        onClose={() => setDeleteTrip(null)}
        trip={deleteTrip}
      />
    </div>
  );
}
