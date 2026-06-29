import * as checklistService from "./checklistItem.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const createChecklistItem = async (req, res) => {
  const checklist = await checklistService.createChecklistItem({
    ...req.body,
    type: req.params.type,
    tripId: req.params.tripId,
    currentUserId: req.user.id,
  });

  ApiResponse.created(res, "Checklist Item Added", checklist);
};

const updateChecklistItem = async (req, res) => {
  const checklistItem = await checklistService.updateChecklistItem({
    ...req.body,
    checklistItemId: req.params.checklistItemId,
    tripId: req.params.tripId,
  });

  ApiResponse.ok(res, "Checklist Item Update Successfull", checklistItem);
};

const getAllChecklistItem = async (req, res) => {
  const checklistItem = await checklistService.getAllchecklistItem({
    ...req.body,
    type: req.params.type,
    tripId: req.params.tripId,
    currentUserId: req.user.id,
  });

  ApiResponse.ok(res, "Checklist Items", checklistItem);
};

const deleteChecklistItem = async (req, res) => {
  const checklistItem = await checklistService.deleteChecklistItem({
    checklistItemId: req.params.checklistItemId,
  });
  ApiResponse.ok(res, "Checklist Item Deleted", checklistItem);
};
export { createChecklistItem, updateChecklistItem, getAllChecklistItem, deleteChecklistItem};
