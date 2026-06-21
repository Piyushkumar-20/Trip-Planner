import "dotenv/config";
import {connectionDB} from "./common/config/db.js";
import app from "./app.js"

const PORT = process.env.PORT || 8080;
const server = async () => {
  await connectionDB();

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
  });
};

server().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
