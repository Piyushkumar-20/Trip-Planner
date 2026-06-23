import { Router } from "express";
import validate from "../../common/validators/validator.js";
import authenticate from "../auth/auth.middleware.js";
import * as controller from "./tripMember.controller.js";
import AddMemberDto from "./dto/add-member.dto.js";

const router = Router();

router.post(
  "/add-member",
  authenticate,
  validate(AddMemberDto),
  controller.addMember,
);
