import ApiError from "../../common/utils/api-error.js";
import Activity from "../activity/activity.model.js";
import Comment from "../comments/comments.model.js";
import { io } from "../../app.js"

const createComment = async ({ activityId, content, currentUserId }) => {
  const activity = await Activity.findById(activityId);
  if (!activity) {
    throw ApiError.notFound("Activity Not found");
  }

  const comment = await Comment.create({
    activityId,
    content,
    userId: currentUserId,
  });

  io.to(`trip_${activity.tripId}`).emit("comment:created", comment);
  return comment;
};

const getAllComment = async ({ activityId }) => {
  return await Comment.find({ activityId }).populate(
    "userId",
    "fullName email",
  );
};

const updateComment = async ({ commentId, content }) => {
  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { content },
    { returnDocument: 'after', runValidators: true },
  )

  if (!comment) {
    throw ApiError.notFound("Comment Not Found!");
  }
  io.to(`trip_${comment.activityId.tripId}`).emit("comment:updated", comment);
  return comment;
};

const deleteComment = async ({ commentId, tripId }) => {
  const comment = await Comment.findOneAndDelete({
    _id: commentId,
  });

  if (!comment) {
    throw ApiError.notFound("Comment not found!");
  }

  io.to(`trip_${tripId}`).emit("comment:deleted", {
    commentId,
  });

  return comment;
};

export { createComment, getAllComment, updateComment, deleteComment };
