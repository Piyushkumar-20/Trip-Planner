import { Router } from "express";
import authenticate from "../auth/auth.middleware.js";
import { loadTripRole, requireRole } from "../../common/middleware/authorize.js";
import { upload } from "../../common/middleware/upload.js";
import * as controller from "./document.controller.js";

const router = Router();

router.post(
  "/:tripId/documents",
  upload.single("file"),
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor", "Viewer"),
  controller.uploadDocument,
);

router.get(
  "/:tripId/documents",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor", "Viewer"),
  controller.getAllDocuments,
);

router.delete(
  "/:tripId/documents/:docId",
  authenticate,
  loadTripRole,
  requireRole("Owner"),
  controller.deleteDocument,
);

export default router;
