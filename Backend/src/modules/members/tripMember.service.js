import Member from "./tripMembers.model.js";
import User from "../users/user.model.js";
import Trip from "../trips/trip.model.js";
import ApiError from "../../common/utils/api-error.js";

const addMember = async ({ tripId, currentUserId, email, role }) => {
  const trip = await Trip.findById(tripId).populate("owner");
  if (!trip) {
    throw ApiError.notFound("Trip Not Found!");
  }

  if (trip.owner.id.toString() !== currentUserId) {
    throw ApiError.unauthorized("You must be a Owner to add member in Trip");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.notFound("User not Found!");
  }

  const existing = await Member.findOne({
    tripId,
    userId: user._id,
  });
  if (existing) {
    throw ApiError.conflict("Trip Member Already Exist");
  }

  const tripMember = await Member.create({
    tripId,
    userId: user._id,
    role,
  });

  return tripMember;
};

export {addMember}