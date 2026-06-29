import Checklist from "../checklists/checklist.model.js";
import ChecklistItem from "../checklists/checklistItem.model.js";
import ApiError from "../../common/utils/api-error.js";
import { io } from "../../app.js";

const getOrCreateChecklist = async ({ tripId, type, ownerId }) => {
  let checklist = await Checklist.findOne({ tripId, type, ownerId });
  if (!checklist) {
    checklist = await Checklist.create({
      tripId,
      type,
      ownerId,
    });
  }

  return checklist;
};

const createChecklistItem = async ({ tripId, type, text, currentUserId }) => {
  let checklist;
  if (type === "Packing") {
    checklist = await getOrCreateChecklist({
      tripId,
      type,
      ownerId: currentUserId,
    });
  } else if (type === "Shared") {
    checklist = await getOrCreateChecklist({
      tripId,
      type,
      ownerId: null,
    });
  } else {
    throw ApiError.badRequest("Invalid Type!");
  }

  const checklistItem = await ChecklistItem.create({
    checklistId: checklist._id,
    text,
    createdBy: currentUserId,
  });

  if (type === "Shared") {
    io.to(`trip_${tripId}`).emit("checklist:itemCreated", checklistItem);
  }

  return checklistItem;
};

const updateChecklistItem = async ({
  checklistItemId,
  completed,
  text,
  tripId,
}) => {
  const checklistItem = await ChecklistItem.findById(checklistItemId);
  if (!checklistItem) {
    throw ApiError.notFound("Checklist Not Found!");
  }

  const checklist = await Checklist.findById(checklistItem.checklistId);
  if (!checklist) {
    throw ApiError.notFound("Checklist Not Found!");
  }

  if (tripId && checklist.tripId.toString() !== tripId.toString()) {
    throw ApiError.notFound("Checklist Not Found!");
  }

  checklistItem.text = text ?? checklistItem.text;
  checklistItem.completed = completed ?? checklistItem.completed;

  await checklistItem.save();
  if (checklist.type === "Shared") {
    io.to(`trip_${checklist.tripId}`).emit(
      "checklist:itemUpdated",
      checklistItem,
    );
  }
  return checklistItem;
};

const getAllchecklistItem = async ({ type, tripId, currentUserId }) => {
  let checklist;
  if (type === "Packing") {
    checklist = await Checklist.findOne({
      tripId,
      type,
      ownerId: currentUserId,
    });
  } else if (type === "Shared") {
    checklist = await Checklist.findOne({
      tripId,
      type,
      ownerId: null,
    });
  } else {
    throw ApiError.badRequest("Invalid Type!");
  }
  if (!checklist) {
    return [];
  }

  const checklistItem = await ChecklistItem.find({
    checklistId: checklist._id,
  });

  if (type === "Shared") {
    io.to(`trip_${tripId}`).emit("checklist:itemCreated", checklistItem);
  }

  return checklistItem;
};

const deleteChecklistItem = async ({ checklistItemId }) => {
  const checklistItem = await ChecklistItem.findById(checklistItemId);

  if (!checklistItem) {
    throw ApiError.notFound("Checklist item not found!");
  }

  const checklist = await Checklist.findById(checklistItem.checklistId);

  await checklistItem.deleteOne();

  if (checklist.type === "Shared") {
    io.to(`trip_${checklist.tripId}`).emit("checklist:itemDeleted", {
      checklistItemId,
    });
  }

  return;
};

export {
  createChecklistItem,
  updateChecklistItem,
  getAllchecklistItem,
  deleteChecklistItem,
};
