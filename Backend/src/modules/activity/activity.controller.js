import * as activityService from "./activity.service.js";
import ApiResponse from "../../common/utils/api-response.js";
import { io } from "../../app.js";

const createActivity = async (req, res) => {
  const activity = await activityService.createActivity({
    ...req.body,
    destinationId: req.params.destinationId,
    currentUserId: req.user.id,
    tripId: req.params.tripId,
  });
  io.to(`trip_${req.params.tripId}`).emit("activity:created", activity);
  ApiResponse.created(res, "Activity Created Successfully!", activity);
};

const updateActivity = async (req, res) => {
  const activity = await activityService.updateActivity({
    ...req.body,
    destinationId: req.params.destinationId,
    activityId: req.params.activityId,
    tripId: req.params.tripId,
  });
  io.to(`trip_${req.params.tripId}`).emit("activity:updateActivity", activity);
  ApiResponse.created(res, "Activity Updated Successfully!", activity);
};

const getAllActivity = async (req, res) => {
  const activity = await activityService.getAllActivity({
    destinationId: req.params.destinationId,
  });
  ApiResponse.created(res, "Activities Of this Destination!", activity);
};

const orderUpdate = async (req, res) => {
  const activity = await activityService.orderUpdate({
    destinationId: req.params.destinationId,
    activities: req.body.activities,
    tripId: req.params.tripId,
  });

  io.to(`trip_${req.params.tripId}`).emit("activity:orderUpdated", activity);

  ApiResponse.ok(res, "Activity Order Updated Successfully!", activity);
};

const deleteActivity = async (req, res) => {
  await activityService.deleteActivity({
    tripId: req.params.tripId,
    destinationId: req.params.destinationId,
    activityId: req.params.activityId,
  });
  io.to(`trip_${req.params.tripId}`).emit("activity:deleted", {
    activityId: req.params.activityId,
  });
  ApiResponse.ok(res, "Activity Removed Successfully!");
};

export {
  createActivity,
  updateActivity,
  getAllActivity,
  orderUpdate,
  deleteActivity,
};
