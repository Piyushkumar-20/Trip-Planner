import { Router } from "express";
import validate from "../../common/validators/validator.js";
import authenticate from "../auth/auth.middleware.js";
import {
  loadTripRole,
  requireRole,
} from "../../common/middleware/authorize.js";
import * as controller from "./destination.controller.js";
import CreateDestinationDto from "./dto/create-destination.dto.js";
import UpdateDestinationDto from "./dto/update-destination.dto.js";

const router = Router();

router.post(
  "/:tripId/destinations",
  authenticate,
  loadTripRole,
  requireRole("Owner"),
  validate(CreateDestinationDto),
  controller.createDestination,
);

router.get(
  "/:tripId/destinations",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor", "Viewer"),
  controller.getAllDestination,
);

router.get(
  "/:tripId/destinations/:destinationId",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor", "Viewer"),
  controller.getdestinationById,
);

router.patch(
  "/:tripId/destinations/:destinationId",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor"),
  validate(UpdateDestinationDto),
  controller.updateDestination,
);

router.delete(
  "/:tripId/destinations/:destinationId",
  authenticate,
  loadTripRole,
  requireRole("Owner"),
  controller.deleteDestination,
);

export default router;
