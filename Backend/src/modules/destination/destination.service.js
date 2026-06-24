import ApiError from "../../common/utils/api-error.js";
import Destination from "./destination.model.js";

const createDestination = async ({
  tripId,
  description,
  name,
  visitDate,
  visitTime,
  estimatedCost,
  currentUserId,
}) => {
  return await Destination.create({
    tripId,
    description,
    name,
    visitDate,
    visitTime,
    estimatedCost,
    createdBy: currentUserId,
  });
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
  return destination;
};

const deleteDestination = async ({ destinationId, tripId }) => {
  return await Destination.findOneAndDelete({ _id: destinationId, tripId });
};

export {
  createDestination,
  getAllDestination,
  getDestinationById,
  updateDestination,
  deleteDestination
};
