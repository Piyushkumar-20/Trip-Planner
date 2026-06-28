import { Router } from "express";
import validate from "../../common/validators/validator.js";
import authenticate from "../auth/auth.middleware.js";
import {
  loadTripRole,
  requireRole,
} from "../../common/middleware/authorize.js";
import * as controller from "./comment.controller.js";
import CreateCommentDto from "./dto/create.dto.js";
import UpdateCommentDto from "./dto/update.dto.js";

const router = Router();

router.post(
  "/:tripId/activities/:activityId/comments",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor", "Viewer"),
  validate(CreateCommentDto),
  controller.createComment,
);

router.get(
  "/:tripId/activities/:activityId/comments",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor", "Viewer"),
  controller.getAllComment,
);

router.patch(
  "/:tripId/comments/:commentId",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor", "Viewer"),
  validate(UpdateCommentDto),
  controller.updateComment,
);

router.delete(
  "/:tripId/comments/:commentId",
  authenticate,
  controller.deleteComment,
);

export default router;
