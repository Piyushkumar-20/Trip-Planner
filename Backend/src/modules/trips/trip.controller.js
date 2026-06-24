import * as tripService from "./trip.service.js";
import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";
import { uploadOnCloudinary } from "../../common/config/cloudinary.js";

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

const uploadCover = async (req, res) => {
  if (!req.file) throw ApiError.badRequest("No file uploaded");

  const result = await uploadOnCloudinary(req.file.path);
  if (!result) throw ApiError.badRequest("Upload failed");

  const trip = await tripService.updateTrip({
    tripId: req.params.tripId,
    updates: { coverImage: result.secure_url },
  });

  ApiResponse.ok(res, "Cover image uploaded", trip);
};

export { createTrip, getAlltrip, updateTrip, deletetrip, uploadCover };
