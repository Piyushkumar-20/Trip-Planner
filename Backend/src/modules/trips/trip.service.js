import Trip from "./trip.model.js";
import ApiError from "../../common/utils/api-error.js";

const createTrip = async ({ title, description, startDate, endDate, owner }) => {
  const existing = await Trip.findOne({ title, owner });
  if (existing) {
    throw ApiError.conflict("Trip with this title already exists");
  }

  const trip = await Trip.create({ title, description, startDate, endDate, owner });

  return trip;
};

export { createTrip };
