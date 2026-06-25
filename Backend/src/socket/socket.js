import { io } from "../app.js";
import { tripHandler } from "./handlers/trip.handler.js";
import { socketAuth } from "./socket.middleware.js";

export const initSocket = () => {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    tripHandler(io, socket);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
