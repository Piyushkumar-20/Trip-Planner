import { Router } from "express";
import validate from "../../common/validators/validator.js";
import authenticate from "../auth/auth.middleware.js";
import {
  loadTripRole,
  requireRole,
} from "../../common/middleware/authorize.js";
import * as controller from "./expense.controller.js";
import CreateExpenseDto from "./dto/create-expense.dto.js";
import UpdateExpenseDto from "./dto/update-expense.dto.js";

const router = Router();

router.post(
  "/:tripId/expenses",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor", "Viewer"),
  validate(CreateExpenseDto),
  controller.createExpense,
);

router.get(
  "/:tripId/expenses",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor", "Viewer"),
  controller.getAllExpenses,
);

router.get(
  "/:tripId/expenses/:expensesId",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor", "Viewer"),
  controller.getExpenseById,
);

router.patch(
  "/:tripId/expenses/:expensesId",
  authenticate,
  loadTripRole,
  requireRole("Owner", "Editor"),
  validate(UpdateExpenseDto),
  controller.updateExpense,
);

router.delete(
  "/:tripId/expenses/:expensesId",
  authenticate,
  loadTripRole,
  requireRole("Owner"),
  controller.deleteExpense,
);

export default router