import Activity from "./activity.model.js";
import Destination from "../destination/destination.model.js";
import ApiError from "../../common/utils/api-error.js";
import { io } from "../../app.js";

const createActivity = async ({
  destinationId,
  title,
  visitDate,
  startTime,
  endTime,
  estimatedCost,
  currentUserId,
}) => {
  const destination = await Destination.findById(destinationId);
  if (!destination) {
    throw ApiError.notFound("Destination Not Found!");
  }

  const lastActivity = await Activity.findOne({ destinationId }).sort({
    order: -1,
  });

  const order = lastActivity ? lastActivity.order + 1 : 1;
  const activity = await Activity.create({
    destinationId,
    order,
    title,
    visitDate,
    startTime,
    endTime,
    estimatedCost,
    createdBy: currentUserId,
  });

  // io.to(`trip_${tripId}`).emit("activity:created", activity);
  return activity;
};

const getAllActivity = async ({ destinationId }) => {
  return await Activity.find({ destinationId })
    .populate("createdBy", "fullName email")
    .sort({ order: 1 });
};

const updateActivity= async ({
  activityId,
  destinationId,
  tripId,
  title,
  description,
  visitDate,
  startTime,
  endTime,
  estimatedCost,
}) => {
  const activity = await Activity.findOne({ destinationId, _id: activityId });
  if (!activity) {
    throw ApiError.notFound("Activity Not Found!");
  }

  activity.title = title ?? activity.title;
  activity.description = description ?? activity.description;
  activity.estimatedCost = estimatedCost ?? activity.estimatedCost;
  activity.startTime = startTime ?? activity.startTime;
  activity.endTime = endTime ?? activity.endTime;
  activity.visitDate = visitDate ?? activity.visitDate;

  await activity.save();
  io.to(`trip_${tripId}`).emit("activity:updated", activity);
  return activity;
};

const orderUpdate = async ({ destinationId, activities, tripId }) => {

  const destination = await Destination.findById(destinationId);

  if (!destination) {
    throw ApiError.notFound("Destination not found!");
  }

  const existingActivities = await Activity.find({ destinationId });

  if (existingActivities.length !== activities.length) {
    throw ApiError.badRequest("Invalid activity list!");
  }

  const bulkOperations = activities.map((activity) => ({
    updateOne: {
      filter: {
        _id: activity.id,
        destinationId,
      },
      update: {
        order: activity.order,
      },
    },
  }));

  await Activity.bulkWrite(bulkOperations);

  const activity = await Activity.find({ destinationId }).sort({
    order: 1,
  });

  io.to(`trip_${tripId}`).emit("activity:orderUpdate", activity);

  return activity;
};

const deleteActivity = async ({ activityId, destinationId, tripId }) => {
  const activity = await Activity.findOneAndDelete({
    _id: activityId,
    destinationId,
  });
  if (!activity) {
    throw ApiError.notFound("Activity Not Found!");
  }

  io.to(`trip_${tripId}`).emit("activity:deleted", activity);
  return activity;
};
export {
  createActivity,
  updateActivity,
  getAllActivity,
  deleteActivity,
  orderUpdate,
};
