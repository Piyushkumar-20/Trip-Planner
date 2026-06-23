import * as memberService from "./tripMember.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const addMember = async (req, res) => {
  const member = await memberService.addMember({
    ...req.body,
    tripId: req.params.tripId,
    currentUserId: req.user.id,
  });

  ApiResponse.created(res, "Member added successfully!", member);
};

const getAllMember = async (req, res) => {
  const member = await memberService.getAllMember({
    tripId: req.params.tripId,
  });
  ApiResponse.ok(res, "Members of this Trip", member);
};

const getMemberById = async (req, res) => {
  const member = await memberService.getMemberById({
    tripId: req.params.tripId,
    memberId: req.params.memberId,
  });
  ApiResponse.ok(res, "Trip's Member", member);
};

const updateMember = async (req, res) => {
  const member = await memberService.updateMember({
    ...req.body,
    tripId: req.params.tripId,
    memberId: req.params.memberId,
    currentUserId: req.user.id,
  });

  ApiResponse.ok(res, "Member Detail Updated Successfully!", member);
};

const deleteMember = async (req, res) => {
  await memberService.deleteMember({
    tripId: req.params.tripId,
    memberId: req.params.memberId,
    currentUserId: req.user.id,
  });
  ApiResponse.ok(res, "Member Deleted Successfully!");
};

export { addMember, getAllMember, getMemberById, updateMember, deleteMember };
