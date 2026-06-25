import * as destinationService from "./destination.service.js";
import ApiResponse from "../../common/utils/api-response.js";
import { io } from "../../app.js";

const createDestination = async (req, res) => {
  const destination = await destinationService.createDestination({
    ...req.body,
    tripId: req.params.tripId,
    currentUserId: req.user.id,
  });
  io.to(`trip_${req.params.tripId}`).emit("destination:created", destination);
  ApiResponse.created(res, "Destination Created Successfully!", destination);
};

const getAllDestination = async (req, res) => {
  const destination = await destinationService.getAllDestination({
    tripId: req.params.tripId,
  });
  ApiResponse.ok(res, "Destinations of this Trip!", destination);
};

const getdestinationById = async (req, res) => {
  const destination = await destinationService.getDestinationById({
    tripId: req.params.tripId,
    destinationId: req.params.destinationId,
  });
  ApiResponse.ok(res, "Destination of this Trip!", destination);
};

const updateDestination = async (req, res) => {
  const destination = await destinationService.updateDestination({
    ...req.body,
    tripId: req.params.tripId,
    destinationId: req.params.destinationId,
  });
  io.to(`trip_${req.params.tripId}`).emit("destination:updated", destination);
  ApiResponse.ok(res, "Destination updated Successfull!", destination);
};

const deleteDestination = async (req, res) => {
  await destinationService.deleteDestination({
    tripId: req.params.tripId,
    destinationId: req.params.destinationId,
  });
  io.to(`trip_${req.params.tripId}`).emit("destination:deleted", { destinationId: req.params.destinationId });
  ApiResponse.ok(res, "Destination Removed Successfully!");
};

export {
  createDestination,
  getAllDestination,
  getdestinationById,
  updateDestination,
  deleteDestination,
};
