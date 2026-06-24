import api from "@/lib/api";

export const tripService = {
  getAll:      ()              => api.get("/trips/getAllTrips"),
  create:      (data)          => api.post("/trips/create-trip", data),
  update:      (tripId, data)  => api.patch(`/trips/${tripId}`, data),
  delete:      (tripId)        => api.delete(`/trips/${tripId}`),
  uploadCover: (tripId, formData) =>
    api.patch(`/trips/${tripId}/cover`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
