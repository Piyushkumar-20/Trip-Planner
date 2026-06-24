import Expenses from "./expenses.model.js";
import ApiError from "../../common/utils/api-error.js";
import Member from "../members/tripMembers.model.js";

const createExpense = async ({ title, tripId, note, amount, category, currentUserId }) => {
  const totalMember = await Member.countDocuments({ tripId });
  if (totalMember <= 0) {
    throw ApiError.notFound("No Member found!");
  }

  return await Expenses.create({
    title,
    tripId,
    note,
    amount,
    shareAmount: amount / totalMember,
    category,
    paidBy: currentUserId,
  });
};

const getAllExpense = async ({ tripId }) => {
  return await Expenses.find({ tripId })
    .populate("paidBy", "fullName email")
    .sort({ createdAt: -1 });
};

const getExpenseById = async ({ tripId, expenseId }) => {
  const expense = await Expenses.findOne({ tripId, _id: expenseId }).populate(
    "paidBy",
    "fullName email",
  );
  if (!expense) throw ApiError.notFound("Expense not found!");
  return expense;
};

const updateExpense = async ({ tripId, expenseId, title, note, amount, category }) => {
  const expense = await Expenses.findOne({ tripId, _id: expenseId });
  if (!expense) throw ApiError.notFound("Expense not found!");

  expense.title = title ?? expense.title;
  expense.note = note ?? expense.note;
  expense.category = category ?? expense.category;

  if (amount !== undefined) {
    const totalMember = await Member.countDocuments({ tripId });
    expense.amount = amount;
    expense.shareAmount = amount / totalMember;
  }

  await expense.save();
  return expense;
};

const deleteExpense = async ({ tripId, expenseId }) => {
  const expense = await Expenses.findOneAndDelete({ _id: expenseId, tripId });
  if (!expense) throw ApiError.notFound("Expense not found!");
  return expense;
};

export { createExpense, getAllExpense, getExpenseById, updateExpense, deleteExpense };
