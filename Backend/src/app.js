import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import express from "express";
import http from "node:http"
import {Server} from 'socket.io'
import authRoute from "./modules/auth/auth.routes.js";
import tripRoute from "./modules/trips/trip.routes.js";
import tripMemberRoute from "./modules/members/tripMember.routes.js";
import destinationRoute from "./modules/destination/destination.routes.js";
import expenseRoute from "./modules/expenses/expense.routes.js";
import documentRoute from "./modules/documents/document.routes.js";

const app = express();
app.use(compression());
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});



app.use("/api/v1/auth", authRoute);
app.use("/api/v1/trips", tripRoute);
app.use("/api/v1/trips", tripMemberRoute);
app.use("/api/v1/trips", destinationRoute);
app.use("/api/v1/trips", expenseRoute);
app.use("/api/v1/trips", documentRoute);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ success: false, message });
});

export { app, server, io };
