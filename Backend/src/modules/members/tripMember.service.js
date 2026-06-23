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

const getAllMember = async ({ tripId }) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw ApiError.notFound("Trip Not Found!");
  }

  const members = await Member.find({ tripId }).populate(
    "userId",
    "fullName email",
  );
  return members;
};

const getMemberById = async ({ tripId, memberId }) => {
  const trip = await Trip.findById({ tripId });
  if (!trip) {
    throw ApiError.notFound("Trip Not Found!");
  }

  const member = await Member.findOne({
    tripId,
    _id: memberId,
  }).populate("userId", "fullName email");

  if (!member) {
    throw ApiError.notFound("Member not found!");
  }

  return member;
};

const updateMember = async ({ tripId, currentUserId, memberId , role}) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw ApiError.notFound("Trip Not found!");
  }

  if (trip.owner.id.toString() !== currentUserId) {
    throw ApiError.unauthorized("You must be a Owner to add member in Trip");
  }

  const updatedMember = await Member.findOneAndUpdate(
    memberId,
    { role },
    { new: true, runValidator: true },
  );

  return updatedMember;
};

const deleteMember = async ({ tripId, memberId }) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw ApiError.notFound("Trip Not found!");
  }
  if (trip.owner.id.toString() !== currentUserId) {
    throw ApiError.unauthorized("You must be a Owner to add member in Trip");
  }

  return await Member.findOneAndDelete(
    memberId,
    { role },
    { new: true, runValidator: true },
  );
};

export { addMember, getAllMember, getMemberById, updateMember, deleteMember };
