import cors from "cors";
import express from "express";
import healthRoute from "./routes/health.js";
import pasteRoutes from "./routes/pastes.js";
import { getNow } from "./utils/time.js";
import redis from "./utils/redis.js";

import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", healthRoute);
app.use("/api", pasteRoutes);

app.get("/", (req, res) => {
  res.send("Pastebin Lite API running");
});



app.get("/p/:id", async (req, res) => {
  const raw = await redis.get(`paste:${req.params.id}`);
  if (!raw) return res.status(404).send("Not found");

  const paste = JSON.parse(raw);
  const now = getNow(req);

  if (
    (paste.expires_at && now >= paste.expires_at) ||
    (paste.max_views && paste.views >= paste.max_views)
  ) {
    return res.status(404).send("Not found");
  }

  res.send(`<pre>${paste.content.replace(/</g, "&lt;")}</pre>`);
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




(async () => {
  try {
    await redis.ping();
    console.log("Redis connected");
  } catch (e) {
    console.error(" Redis failed", e);
  }
})();
