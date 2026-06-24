import * as documentService from "./document.service.js";
import ApiError from "../../common/utils/api-error.js";
import ApiResponse from "../../common/utils/api-response.js";

const uploadDocument = async (req, res) => {
  console.log("1. req.file:", req.file);
  if (!req.file) throw ApiError.badRequest("No file uploaded");

  console.log("2. calling uploadDocument service, path:", req.file.path);
  const doc = await documentService.uploadDocument({
    tripId: req.params.tripId,
    filePath: req.file.path,
    fileName: req.file.originalname,
    currentUserId: req.user.id,
  });

  console.log("3. doc created:", doc._id);
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
  ApiResponse.ok(res, "Document deleted", doc);
};

export { uploadDocument, getAllDocuments, deleteDocument };
