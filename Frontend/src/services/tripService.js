import api from "@/lib/api";

export const tripService = {
  getAll: () => api.get("/trips/getAllTrips"),
  create: (data) => api.post("/trips/create-trip", data),
  update: (data) => api.post("/trips/updateTrip", data),
  delete: (title) => api.post("/trips/deleteTrip", { title }),
};
