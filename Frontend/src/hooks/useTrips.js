import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tripService } from "@/services/tripService";

export const useTrips = () =>
  useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const res = await tripService.getAll();
      return res.data.data;
    },
  });

export const useCreateTrip = (onSuccess) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => tripService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trips"] });
      toast.success("Trip created successfully");
      onSuccess?.();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to create trip"),
  });
};

export const useUpdateTrip = (onSuccess) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => tripService.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trips"] });
      toast.success("Trip updated successfully");
      onSuccess?.();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update trip"),
  });
};

export const useDeleteTrip = (onSuccess) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (title) => tripService.delete(title),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trips"] });
      toast.success("Trip deleted successfully");
      onSuccess?.();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to delete trip"),
  });
};
