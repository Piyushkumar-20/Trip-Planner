export const tripHandler = (io, socket) => {
  socket.on("join-trip", (tripId) => {
    socket.join(`trip_${tripId}`);
    console.log(`Socket ${socket.id} joined trip_${tripId}`);
  });

  socket.on("leave-trip", (tripId) => {
    socket.leave(`trip_${tripId}`);
    console.log(`Socket ${socket.id} left trip_${tripId}`);
  });
};
