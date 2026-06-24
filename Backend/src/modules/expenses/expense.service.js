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

const getTripBalances = async ({ tripId }) => {
  const [expenses, members] = await Promise.all([
    Expenses.find({ tripId }),
    Member.find({ tripId }).populate("userId", "fullName email"),
  ]);

  const balanceMap = {};

  members.forEach(({ userId }) => {
    balanceMap[userId._id] = {
      user: { _id: userId._id, fullName: userId.fullName, email: userId.email },
      paid: 0,
      owes: 0,
      balance: 0,
    };
  });

  expenses.forEach(({ paidBy, amount, shareAmount }) => {
    if (balanceMap[paidBy]) {
      balanceMap[paidBy].paid += amount;
    }
    members.forEach(({ userId }) => {
      balanceMap[userId._id].owes += shareAmount;
    });
  });

  return Object.values(balanceMap).map((entry) => ({
    ...entry,
    balance: entry.paid - entry.owes,
  }));
};

export { createExpense, getAllExpense, getExpenseById, updateExpense, deleteExpense, getTripBalances };
