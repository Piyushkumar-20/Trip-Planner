import { Router } from "express";
import validate from "../../common/validators/validator.js";
import authenticate from "../auth/auth.middleware.js";
import {
  loadTripRole,
  requireRole,
} from "../../common/middleware/authorize.js";
import createActivityDto from "./dto/create.dto.js";
import updateActivityDto from "./dto/update.dto.js";
import ReorderActivityDto from "./dto/orderUpdate.dto.js";
import * as controller from "./activity.controller.js";

const router = Router();

router.post(
  "/:tripId/destinations/:destinationId/activities",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor"),
  validate(createActivityDto),
  controller.createActivity,
);

router.get(
  "/:tripId/destinations/:destinationId/activities",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor", "Viewer"),
  controller.getAllActivity,
);

router.patch(
  "/:tripId/destinations/:destinationId/activities/reorder",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor"),
  validate(ReorderActivityDto),
  controller.orderUpdate,
);

router.patch(
  "/:tripId/destinations/:destinationId/activities/:activityId",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor"),
  validate(updateActivityDto),
  controller.updateActivity,
);

router.delete(
  "/:tripId/destinations/:destinationId/activities/:activityId",
  authenticate,
  loadTripRole,
  requireRole("Owner"),
  controller.deleteActivity,
);

export default router;
