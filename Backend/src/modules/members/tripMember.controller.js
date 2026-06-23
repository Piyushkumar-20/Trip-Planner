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
export { addMember };
