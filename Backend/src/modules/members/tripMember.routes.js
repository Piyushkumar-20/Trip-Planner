import { Router } from "express";
import validate from "../../common/validators/validator.js";
import authenticate from "../auth/auth.middleware.js";
import * as controller from "./tripMember.controller.js";
import AddMemberDto from "./dto/add-member.dto.js";
import UpdateMemberRoleDto from "./dto/update-member-role.dto.js";

const router = Router();

router.post(
  "/:tripId/members",
  authenticate,
  validate(AddMemberDto),
  controller.addMember,
);

router.get("/:tripId/members", authenticate, controller.getAllMember);

router.get(
  "/:tripId/members/:memberId",
  authenticate,
  controller.getMemberById,
);

router.patch(
  "/:tripId/members/:memberId",
  authenticate,
  validate(UpdateMemberRoleDto),
  controller.updateMember,
);

router.delete(
  "/:tripId/members/:memberId",
  authenticate,
  controller.deleteMember,
);
export default router;
