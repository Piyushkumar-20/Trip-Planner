import * as commentService from "./comments.service.js";
import ApiResponse from "../../common/utils/api-response.js";
import { io } from "../../app.js"

const createComment = async (req, res) => {
  const comment = await commentService.createComment({
    ...req.body,
    activityId: req.params.activityId,
    currentUserId: req.user.id,
  });
  ApiResponse.created(res, "Comment Added", comment);
};

const updateComment = async (req, res) => {
  const comment = await commentService.updateComment({
    ...req.body,
    commentId: req.params.commentId,
  });
  ApiResponse.ok(res, "Comment Updated", comment);
};

const getAllComment = async (req, res) => {
  const comment = await commentService.getAllComment({
    commentId: req.params.commentId,
  });
  ApiResponse.ok(res, "Comments!", comment);
};

const deleteComment = async (req, res) => {
  await commentService.deleteComment({
    tripId: req.params.tripId,
    commentId: req.params.commentId,
  });
  io.to(`trip_${req.params.tripId}`).emit("comment:deleted", {
    commentId: req.params.commentId,
  });
  ApiResponse.noContent(res, "Comment Removed Successfully!");
};

export { createComment, updateComment, getAllComment, deleteComment };
