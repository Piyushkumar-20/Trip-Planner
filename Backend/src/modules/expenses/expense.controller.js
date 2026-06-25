import * as expenseService from "./expense.service.js";
import ApiResponse from "../../common/utils/api-response.js";
import { io } from "../../app.js";

const createExpense = async (req, res) => {
  const expenses = await expenseService.createExpense({
    ...req.body,
    tripId: req.params.tripId,
    currentUserId: req.user.id,
  });
  io.to(`trip_${req.params.tripId}`).emit("expense:created", expenses);
  ApiResponse.created(res, "Expense Added!", expenses);
};

const getAllExpenses = async (req, res) => {
  const expenses = await expenseService.getAllExpense({
    tripId: req.params.tripId,
  });
  ApiResponse.ok(res, "List of Expenses!", expenses);
};

const getExpenseById = async (req, res) => {
  const expenses = await expenseService.getExpenseById({
    tripId: req.params.tripId,
    expenseId: req.params.expenseId,
  });
  ApiResponse.ok(res, "This is the Expense!", expenses);
};

const updateExpense = async (req, res) => {
  const expenses = await expenseService.updateExpense({
    ...req.body,
    tripId: req.params.tripId,
    expenseId: req.params.expenseId,
  });
  io.to(`trip_${req.params.tripId}`).emit("expense:updated", expenses);
  ApiResponse.ok(res, "Expense Updated!", expenses);
};

const deleteExpense = async (req, res) => {
  const expenses = await expenseService.deleteExpense({
    tripId: req.params.tripId,
    expenseId: req.params.expenseId,
  });
  io.to(`trip_${req.params.tripId}`).emit("expense:deleted", { expenseId: req.params.expenseId });
  ApiResponse.ok(res, "Expense Deleted!", expenses);
};

const getTripBalances = async (req, res) => {
  const balances = await expenseService.getTripBalances({
    tripId: req.params.tripId,
  });
  ApiResponse.ok(res, "Trip balances!", balances);
};

export {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getTripBalances,
};
