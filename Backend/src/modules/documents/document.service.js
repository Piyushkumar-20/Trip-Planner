import { v2 as cloudinary } from "cloudinary";
import { uploadOnCloudinary } from "../../common/config/cloudinary.js";
import ApiError from "../../common/utils/api-error.js";
import Document from "./document.model.js";
import { io } from "../../app.js";

const uploadDocument = async ({ tripId, filePath, fileName, currentUserId }) => {
  const result = await uploadOnCloudinary(filePath);
  if (!result) throw ApiError.badRequest("Upload failed");

  const document = await Document.create({
    tripId,
    name: fileName,
    url: result.secure_url,
    publicId: result.public_id,
    uploadedBy: currentUserId,
  });

  io.to(`trip_${tripId}`).emit("document:uploaded", document);
  return document;
};

const getAllDocuments = async ({ tripId }) => {
  return await Document.find({ tripId })
    .populate("uploadedBy", "fullName email")
    .sort({ createdAt: -1 });
};

const deleteDocument = async ({ docId, tripId }) => {
  const doc = await Document.findOne({ _id: docId, tripId });
  if (!doc) throw ApiError.notFound("Document not found!");

  await cloudinary.uploader.destroy(doc.publicId, { resource_type: "raw" });
  await doc.deleteOne();
  io.to(`trip_${tripId}`).emit("document:deleted", { docId });
  return doc;
};

export { uploadDocument, getAllDocuments, deleteDocument };
