import express from "express";
import * as controller from "./checklistItem.controller.js";
import validate from "../../common/validators/validator.js"
import {
  UpdateChecklistItemDto,
  CreateChecklistItemDto,
} from "./dto/checklist-item.dto.js";

import authenticate from "../auth/auth.middleware.js";
import {
  loadTripRole,
  requireRole,
} from "../../common/middleware/authorize.js";

const router = express.Router();

router.post(
  "/:tripId/:type",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor", "Viewer"),
  validate(CreateChecklistItemDto),
  controller.createChecklistItem,
);

router.get(
  "/:tripId/:type",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor", "Viewer"),
  controller.getAllChecklistItem,
);

router.patch(
  "/:tripId/:checklistItemId/",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor", "Viewer"),
  validate(UpdateChecklistItemDto),
  controller.updateChecklistItem,
);

router.delete(
  "/:tripId/:checklistItemId",
  authenticate,
  loadTripRole,
  controller.deleteChecklistItem,
);

export default router;
