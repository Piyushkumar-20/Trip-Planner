import * as memberService from "./tripMember.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const addMember = async (req, res) => {
  const member = await memberService.addMember({
    email: req.body.email,
    role: req.body.role,
    tripId: req.params.tripId,
    currentUserId: req.user.id,
  });

  ApiResponse.created(res, "Member Added Successfully!", member);
};

export { addMember };
