import Trip from "./trip.model.js";
import ApiError from "../../common/utils/api-error.js";

const createTrip = async ({ title, description, startDate, endDate, userId }) => {
  const existing = await Trip.findOne({ title, owner: userId });
  if (existing) {
    throw ApiError.conflict("Trip with this title already exists");
  }

  const trip = await Trip.create({ title, description, startDate, endDate, owner: userId });

  return trip;
};

export { createTrip };
