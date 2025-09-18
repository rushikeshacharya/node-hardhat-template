import http from "http";
import app from "./app.js";
import "dotenv/config";
import connectDB from "./config/db.js"; // your earlier DB connect file

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB(); // ensure DB connected
  const server = http.createServer(app);
  server.listen(PORT, () => console.log(`Server running on ${PORT}`));
})();
