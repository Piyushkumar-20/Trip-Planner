import "dotenv/config";
import {connectionDB} from "./common/config/db.js";
import { server } from "./app.js"
import { initSocket } from "./socket/socket.js";

const PORT = process.env.PORT || 8080;
const startServer = async () => {
  await connectionDB();

  initSocket();

  server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
