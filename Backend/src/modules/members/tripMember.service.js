import Member from "./tripMembers.model.js";
import User from "../users/user.model.js";
import ApiError from "../../common/utils/api-error.js";

const addMember = async ({ tripId, email, role }) => {
  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound("User not found!");

  const existing = await Member.findOne({ tripId, userId: user._id });
  if (existing) throw ApiError.conflict("User is already a member of this trip");

  return await Member.create({ tripId, userId: user._id, role });
};

const getAllMember = async ({ tripId }) => {
  return await Member.find({ tripId }).populate("userId", "fullName email");
};

const getMemberById = async ({ tripId, memberId }) => {
  const member = await Member.findOne({ tripId, _id: memberId }).populate(
    "userId",
    "fullName email",
  );
  if (!member) throw ApiError.notFound("Member not found!");
  return member;
};

const updateMember = async ({ tripId, memberId, role }) => {
  const member = await Member.findOneAndUpdate(
    { _id: memberId, tripId },
    { role },
    { new: true, runValidators: true },
  );
  if (!member) throw ApiError.notFound("Member not found!");
  return member;
};

const deleteMember = async ({ tripId, memberId }) => {
  const member = await Member.findOneAndDelete({ _id: memberId, tripId });
  if (!member) throw ApiError.notFound("Member not found!");
  return member;
};

export { addMember, getAllMember, getMemberById, updateMember, deleteMember };
