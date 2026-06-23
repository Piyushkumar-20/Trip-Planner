import { Router } from "express";
import validate from "../../common/validators/validator.js";
import authenticate from "../auth/auth.middleware.js";
import * as controller from "./trip.controller.js";
import CreateTripDto from "./dto/create-trip.dto.js";

const router = Router();

router.post("/create-trip", authenticate, validate(CreateTripDto), controller.createTrip);

export default router;
