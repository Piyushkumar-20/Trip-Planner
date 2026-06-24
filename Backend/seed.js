import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/modules/users/user.model.js";
import Trip from "./src/modules/trips/trip.model.js";
import Member from "./src/modules/members/tripMembers.model.js";
import Expense from "./src/modules/expenses/expenses.model.js";

const MEMBER_COUNT = 3;

const users = [
  { fullName: "Piyush Kumar",  email: "piyush@seed.com", password: "Seed@1234" },
  { fullName: "Rahul Sharma",  email: "rahul@seed.com",  password: "Seed@1234" },
  { fullName: "Aman Verma",    email: "aman@seed.com",   password: "Seed@1234" },
];

// 10 expenses — paid by different members so balances are unequal
// Piyush pays the most, Aman pays the least → clear unsettled balances
const expenseTemplates = [
  { title: "Hotel Booking",       amount: 6000, category: "Hotel",     note: "3 nights",     paidByIndex: 0 },
  { title: "Airport Cab",         amount: 1200, category: "Transport", note: "to/from",      paidByIndex: 0 },
  { title: "Dinner Day 1",        amount: 2400, category: "Food",      note: "rooftop resto", paidByIndex: 0 },
  { title: "Theme Park Tickets",  amount: 3000, category: "Other",     note: "full day",     paidByIndex: 0 },
  { title: "Breakfast Buffet",    amount: 900,  category: "Food",      note: "day 2",        paidByIndex: 1 },
  { title: "City Tour Bus",       amount: 600,  category: "Transport", note: "half day",     paidByIndex: 1 },
  { title: "Souvenir Shopping",   amount: 1500, category: "Shopping",  note: undefined,      paidByIndex: 1 },
  { title: "Lunch Day 2",         amount: 750,  category: "Food",      note: undefined,      paidByIndex: 2 },
  { title: "Museum Tickets",      amount: 450,  category: "Other",     note: "3 entries",    paidByIndex: 2 },
  { title: "Petrol Refill",       amount: 300,  category: "Transport", note: undefined,      paidByIndex: 2 },
];

async function seed() {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("Connected to DB");

  // Clean up previous seed data
  const oldUsers = await User.find({ email: { $in: users.map((u) => u.email) } });
  const oldUserIds = oldUsers.map((u) => u._id);
  if (oldUserIds.length) {
    const oldTrips = await Trip.find({ owner: { $in: oldUserIds } });
    const oldTripIds = oldTrips.map((t) => t._id);
    await Expense.deleteMany({ tripId: { $in: oldTripIds } });
    await Member.deleteMany({ tripId: { $in: oldTripIds } });
    await Trip.deleteMany({ _id: { $in: oldTripIds } });
    await User.deleteMany({ _id: { $in: oldUserIds } });
    console.log("Cleaned previous seed data");
  }

  // Create users (pre-save hook hashes passwords)
  const createdUsers = await Promise.all(
    users.map((u) => User.create({ ...u, isVerified: true }))
  );
  console.log("Users created:", createdUsers.map((u) => u.email).join(", "));

  // Create trip owned by Piyush
  const trip = await Trip.create({
    title: "Goa Trip 2026",
    description: "Annual beach trip with the boys — sun, food, and good vibes.",
    owner: createdUsers[0]._id,
    startDate: new Date("2026-07-10"),
    endDate:   new Date("2026-07-14"),
  });
  console.log("Trip created:", trip.title);

  // Add all 3 as members (Piyush=Editor since Owner is separate, others=Viewer)
  await Member.create([
    { tripId: trip._id, userId: createdUsers[0]._id, role: "Editor"  },
    { tripId: trip._id, userId: createdUsers[1]._id, role: "Editor"  },
    { tripId: trip._id, userId: createdUsers[2]._id, role: "Viewer"  },
  ]);
  console.log("Members added");

  // Create 10 expenses
  const shareAmount = (amount) => amount / MEMBER_COUNT;

  await Expense.create(
    expenseTemplates.map((e) => ({
      tripId:      trip._id,
      title:       e.title,
      amount:      e.amount,
      category:    e.category,
      note:        e.note,
      paidBy:      createdUsers[e.paidByIndex]._id,
      shareAmount: shareAmount(e.amount),
    }))
  );
  console.log("10 expenses created");

  // Print expected balances
  const paid  = [0, 0, 0];
  const owes  = [0, 0, 0];
  expenseTemplates.forEach((e) => {
    paid[e.paidByIndex] += e.amount;
    for (let i = 0; i < MEMBER_COUNT; i++) owes[i] += shareAmount(e.amount);
  });

  console.log("\n── Expected Balances ──");
  users.forEach((u, i) => {
    const balance = paid[i] - owes[i];
    const sign = balance > 0 ? "+" : "";
    console.log(`${u.fullName.padEnd(15)} Paid ₹${paid[i]}   Owes ₹${owes[i].toFixed(0)}   Balance: ${sign}₹${balance.toFixed(0)}`);
  });

  console.log("\n── Login Credentials ──");
  users.forEach((u) => console.log(`${u.email}  /  ${u.password}`));

  await mongoose.disconnect();
  console.log("\nDone.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
