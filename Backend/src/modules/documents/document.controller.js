import * as documentService from "./document.service.js";
import ApiError from "../../common/utils/api-error.js";
import ApiResponse from "../../common/utils/api-response.js";
import { io } from "../../app.js";

const uploadDocument = async (req, res) => {
  if (!req.file) throw ApiError.badRequest("No file uploaded");

  const doc = await documentService.uploadDocument({
    tripId: req.params.tripId,
    filePath: req.file.path,
    fileName: req.file.originalname,
    currentUserId: req.user.id,
  });

  io.to(`trip_${req.params.tripId}`).emit("document:uploaded", doc);
  ApiResponse.created(res, "Document uploaded", doc);
};

const getAllDocuments = async (req, res) => {
  const docs = await documentService.getAllDocuments({
    tripId: req.params.tripId,
  });
  ApiResponse.ok(res, "Documents fetched", docs);
};

const deleteDocument = async (req, res) => {
  const doc = await documentService.deleteDocument({
    docId: req.params.docId,
    tripId: req.params.tripId,
  });
  io.to(`trip_${req.params.tripId}`).emit("document:deleted", { docId: req.params.docId });
  ApiResponse.ok(res, "Document deleted", doc);
};

export { uploadDocument, getAllDocuments, deleteDocument };
