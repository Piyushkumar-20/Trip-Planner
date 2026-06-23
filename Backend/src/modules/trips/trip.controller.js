import * as tripService from "./trip.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const createTrip = async (req, res) => {
  const trip = await tripService.createTrip({ ...req.body, owner: req.user.id });
  ApiResponse.created(res, "Trip Created Successfully", trip);
};

export { createTrip };
