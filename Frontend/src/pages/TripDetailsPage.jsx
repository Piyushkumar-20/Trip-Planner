import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  User,
  Pencil,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTrips } from "@/hooks/useTrips";
import { useMembers } from "@/hooks/useMembers";
import TripFormDialog from "@/components/trips/TripFormDialog";
import DeleteTripDialog from "@/components/trips/DeleteTripDialog";
import AddMemberDialog from "@/components/members/AddMemberDialog";
import UpdateRoleDialog from "@/components/members/UpdateRoleDialog";
import RemoveMemberDialog from "@/components/members/RemoveMemberDialog";
import MemberTable from "@/components/members/MemberTable";
import EmptyState from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function getTripStatus(trip) {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  if (now < start) return { label: "Upcoming", variant: "secondary" };
  if (now > end) return { label: "Completed", variant: "outline" };
  return { label: "Active", variant: "default" };
}

export default function TripDetailsPage() {
  const { tripId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: allTrips, isLoading: tripsLoading } = useTrips();
  const trip = state?.trip ?? allTrips?.find((t) => t._id === tripId);

  const { data: members, isLoading: membersLoading } = useMembers(tripId);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [updateRoleOpen, setUpdateRoleOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const isOwner =
    trip?.owner?.toString() === user?._id?.toString() ||
    trip?.owner?.toString() === user?.id?.toString();

  if (tripsLoading && !trip) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!trip) {
    return (
      <EmptyState
        title="Trip not found"
        description="This trip may have been deleted or you don't have access."
        action={
          <Button onClick={() => navigate("/trips")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trips
          </Button>
        }
      />
    );
  }

  const status = getTripStatus(trip);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/trips")}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-semibold tracking-tight truncate">
                  {trip.title}
                </h1>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              {trip.description && (
                <p className="text-muted-foreground text-sm">{trip.description}</p>
              )}
            </div>
            {isOwner && (
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                  <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Start Date</p>
                <p className="font-medium">
                  {format(new Date(trip.startDate), "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">End Date</p>
                <p className="font-medium">
                  {format(new Date(trip.endDate), "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Owner</p>
                <p className="font-medium">{user?.fullName}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members
            {members && (
              <Badge variant="secondary" className="ml-1">
                {members.length}
              </Badge>
            )}
          </CardTitle>
          {isOwner && (
            <Button size="sm" onClick={() => setAddMemberOpen(true)}>
              <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Add Member
            </Button>
          )}
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          {membersLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : members?.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No members yet"
              description="Add members to collaborate on this trip."
            />
          ) : (
            <MemberTable
              members={members}
              loading={false}
              isOwner={isOwner}
              onUpdateRole={(m) => {
                setSelectedMember(m);
                setUpdateRoleOpen(true);
              }}
              onRemove={(m) => {
                setSelectedMember(m);
                setRemoveOpen(true);
              }}
            />
          )}
        </CardContent>
      </Card>

      <TripFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        trip={trip}
      />
      <DeleteTripDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          navigate("/trips");
        }}
        trip={trip}
      />
      <AddMemberDialog
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        tripId={tripId}
      />
      <UpdateRoleDialog
        open={updateRoleOpen}
        onClose={() => setUpdateRoleOpen(false)}
        member={selectedMember}
        tripId={tripId}
      />
      <RemoveMemberDialog
        open={removeOpen}
        onClose={() => setRemoveOpen(false)}
        member={selectedMember}
        tripId={tripId}
      />
    </div>
  );
}
