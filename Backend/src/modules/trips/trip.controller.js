import * as tripService from "./trip.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const createTrip = async (req, res) => {
  const trip = await tripService.createTrip({
    ...req.body,
    owner: req.user.id,
  });
  ApiResponse.created(res, "Trip Created Successfully", trip);
};

const getAlltrip = async (req, res) => {
  const trips = await tripService.getAllTrip({ userId: req.user.id });
  ApiResponse.ok(res, "Here's Your Trips", trips);
};

const updateTrip = async (req, res) => {
  const trip = await tripService.updateTrip({
    tripId: req.params.tripId,
    updates: req.body,
  });
  ApiResponse.ok(res, "Trip Updated", trip);
};

const deletetrip = async (req, res) => {
  const trip = await tripService.deleteTrip(req.params.tripId);
  ApiResponse.ok(res, "Trip Deleted!", trip);
};

export { createTrip, getAlltrip, updateTrip, deletetrip };
