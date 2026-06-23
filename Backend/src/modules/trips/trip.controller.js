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
  const trips = await tripService.getAllTrip({ ...req.body });
  ApiResponse.ok(res, "Hers's Your Trips", trips);
};

const updateTrip = async (req, res) => {
  const { title, newTitle, ...rest } = req.body;
  const updates = newTitle ? { ...rest, title: newTitle } : rest;
  const trip = await tripService.updateTrip({ title, updates, owner: req.user.id });
  ApiResponse.ok(res, "Trip Updated", trip);
};

const deletetrip = async (req, res) => {
  const { title } = req.body;
  const trip = await tripService.deleteTrip(title, req.user.id);
  ApiResponse.ok(res, "Trip Deleted!", trip);
};

export { createTrip, getAlltrip, updateTrip, deletetrip };
