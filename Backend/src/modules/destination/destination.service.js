import ApiError from "../../common/utils/api-error.js";
import Destination from "./destination.model.js";
import { io } from "../../app.js";

const createDestination = async ({
  tripId,
  description,
  name,
  visitDate,
  visitTime,
  estimatedCost,
  currentUserId,
}) => {
  const destination = await Destination.create({
    tripId,
    description,
    name,
    visitDate,
    visitTime,
    estimatedCost,
    createdBy: currentUserId,
  });

  io.to(`trip_${tripId}`).emit("destination:created", destination);
  return destination;
};

const getAllDestination = async ({ tripId }) => {
  return await Destination.find({ tripId })
    .populate("createdBy", "fullName email")
    .sort({ visitDate: 1, visitTime: 1 });
};

const getDestinationById = async ({ tripId, destinationId }) => {
  return await Destination.findOne({ tripId, _id: destinationId }).populate(
    "createdBy",
    "fullName email",
  );
};

const updateDestination = async ({
  destinationId,
  tripId,
  description,
  name,
  visitDate,
  visitTime,
  estimatedCost,
}) => {
  const destination = await Destination.findOne({ tripId, _id: destinationId });
  if (!destination) {
    throw ApiError.notFound("Destination Not Found!");
  }

  destination.name = name ?? destination.name;
  destination.description = description ?? destination.description;
  destination.estimatedCost = estimatedCost ?? destination.estimatedCost;
  destination.visitTime = visitTime ?? destination.visitTime;
  destination.visitDate = visitDate ?? destination.visitDate;

  await destination.save();
  io.to(`trip_${tripId}`).emit("destination:updated", destination);
  return destination;
};

const deleteDestination = async ({ destinationId, tripId }) => {
  const destination = await Destination.findOneAndDelete({ _id: destinationId, tripId });
  if (destination) io.to(`trip_${tripId}`).emit("destination:deleted", { destinationId });
  return destination;
};

export {
  createDestination,
  getAllDestination,
  getDestinationById,
  updateDestination,
  deleteDestination
};
