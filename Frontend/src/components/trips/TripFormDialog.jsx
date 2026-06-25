import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, ImagePlus, X } from "lucide-react";
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
import { useQueryClient } from "@tanstack/react-query";
import { useCreateTrip, useUpdateTrip } from "@/hooks/useTrips";
import { tripService } from "@/services/tripService";

export default function TripFormDialog({ open, onClose, trip }) {
  const isEdit   = !!trip;
  const imageRef = useRef(null);
  const qc       = useQueryClient();

  const [startDate,    setStartDate]    = useState(null);
  const [endDate,      setEndDate]      = useState(null);
  const [coverFile,    setCoverFile]    = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const createTrip = useCreateTrip(async (res) => {
    await handleCoverUpload(res?.data?.data?._id);
    onClose();
  });

  const updateTrip = useUpdateTrip(async (res) => {
    await handleCoverUpload(res?.data?.data?._id ?? trip?._id);
    onClose();
  });

  const isPending = createTrip.isPending || updateTrip.isPending;

  const handleCoverUpload = async (tripId) => {
    if (!coverFile || !tripId) return;
    const fd = new FormData();
    fd.append("cover", coverFile);
    await tripService.uploadCover(tripId, fd);
    qc.invalidateQueries({ queryKey: ["trips"] });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (imageRef.current) imageRef.current.value = "";
  };

  useEffect(() => {
    if (open) {
      if (trip) {
        reset({ title: trip.title, description: trip.description ?? "" });
        setStartDate(trip.startDate ? new Date(trip.startDate) : null);
        setEndDate(trip.endDate ? new Date(trip.endDate) : null);
        setCoverPreview(trip.coverImage ?? null);
      } else {
        reset({ title: "", description: "" });
        setStartDate(null);
        setEndDate(null);
        setCoverPreview(null);
      }
      setCoverFile(null);
    }
  }, [open, trip, reset]);

  const onSubmit = (values) => {
    if (!startDate || !endDate) return;
    const payload = {
      title:       values.title.trim(),
      description: values.description?.trim() || "",
      startDate:   startDate.toISOString(),
      endDate:     endDate.toISOString(),
    };

    if (isEdit) {
      updateTrip.mutate({ tripId: trip._id, ...payload });
    } else {
      createTrip.mutate(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Trip" : "Create New Trip"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Cover image picker */}
          <div className="space-y-1.5">
            <Label>Cover Image <span className="text-muted-foreground">(optional)</span></Label>
            {coverPreview ? (
              <div className="relative h-32 w-full overflow-hidden rounded-lg border">
                <img src={coverPreview} alt="cover" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/50 p-0.5 text-white hover:bg-black/70"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => imageRef.current?.click()}
                className="flex h-24 w-full items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                <ImagePlus className="h-4 w-4" />
                Click to add a cover image
              </button>
            )}
            <input
              ref={imageRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Summer in Europe"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What's this trip about?"
              rows={3}
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "MMM d, yyyy") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
              {!startDate && <p className="text-xs text-muted-foreground">Required</p>}
            </div>

            <div className="space-y-1.5">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "MMM d, yyyy") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(d) => startDate && d < startDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {!endDate && <p className="text-xs text-muted-foreground">Required</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !startDate || !endDate}>
              {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Trip"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
