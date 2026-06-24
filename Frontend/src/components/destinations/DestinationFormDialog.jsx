import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCreateDestination, useUpdateDestination } from "@/hooks/useDestinations";

export default function DestinationFormDialog({ open, onClose, tripId, destination }) {
  const isEdit = !!destination;
  const [visitDate, setVisitDate] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const createDestination = useCreateDestination(tripId, onClose);
  const updateDestination = useUpdateDestination(tripId, onClose);
  const isPending = createDestination.isPending || updateDestination.isPending;

  useEffect(() => {
    if (open) {
      if (destination) {
        reset({
          name: destination.name,
          description: destination.description,
          visitTime: destination.visitTime,
          estimatedCost: destination.estimatedCost,
        });
        setVisitDate(destination.visitDate ? new Date(destination.visitDate) : null);
      } else {
        reset({ name: "", description: "", visitTime: "", estimatedCost: "" });
        setVisitDate(null);
      }
    }
  }, [open, destination, reset]);

  const onSubmit = (values) => {
    if (!visitDate) return;
    const payload = {
      name: values.name.trim(),
      description: values.description.trim(),
      visitDate: visitDate.toISOString(),
      visitTime: values.visitTime,
      estimatedCost: values.estimatedCost.trim(),
    };

    if (isEdit) {
      updateDestination.mutate({ destinationId: destination._id, ...payload });
    } else {
      createDestination.mutate(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Destination" : "Add Destination"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="dest-name">Name</Label>
            <Input
              id="dest-name"
              placeholder="e.g. Eiffel Tower"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 5, message: "At least 5 characters" },
                maxLength: { value: 50, message: "At most 50 characters" },
              })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dest-description">Description</Label>
            <Textarea
              id="dest-description"
              placeholder="What's special about this place?"
              rows={3}
              {...register("description", {
                required: "Description is required",
                minLength: { value: 10, message: "At least 10 characters" },
                maxLength: { value: 300, message: "At most 300 characters" },
              })}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Visit Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !visitDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {visitDate ? format(visitDate, "MMM d, yyyy") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={visitDate}
                    onSelect={setVisitDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {!visitDate && (
                <p className="text-xs text-muted-foreground">Required</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dest-time">Visit Time</Label>
              <Input
                id="dest-time"
                type="time"
                {...register("visitTime", { required: "Time is required" })}
              />
              {errors.visitTime && (
                <p className="text-xs text-destructive">{errors.visitTime.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dest-cost">Estimated Cost</Label>
            <Input
              id="dest-cost"
              placeholder="e.g. 25 or Free"
              {...register("estimatedCost", { required: "Estimated cost is required" })}
            />
            {errors.estimatedCost && (
              <p className="text-xs text-destructive">{errors.estimatedCost.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !visitDate}>
              {isPending ? "Saving..." : isEdit ? "Save Changes" : "Add Destination"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
