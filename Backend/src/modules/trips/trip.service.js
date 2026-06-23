import Trip from "./trip.model.js";
import ApiError from "../../common/utils/api-error.js";

const createTrip = async ({
  title,
  description,
  startDate,
  endDate,
  owner,
}) => {
  const existing = await Trip.findOne({ title, owner });
  if (existing) {
    throw ApiError.conflict("Trip with this title already exists");
  }

  const trip = await Trip.create({
    title,
    description,
    startDate,
    endDate,
    owner,
  });

  return trip;
};

const getAllTrip = async () => {
  const trips = await Trip.find();
  return trips;
};

const updateTrip = async ({ title, updates, owner }) => {
  const trip = await Trip.findOneAndUpdate({ title, owner }, updates, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!trip) {
    throw ApiError.notFound("Trip Not Found!");
  }

  return trip;
};

const deleteTrip = async (title, owner) => {
  const trip = await Trip.findOneAndDelete({ title, owner });
  if (!trip) {
    throw ApiError.notFound("Trip Not Found!");
  }
  return trip;
};

export { createTrip, getAllTrip, updateTrip, deleteTrip };
