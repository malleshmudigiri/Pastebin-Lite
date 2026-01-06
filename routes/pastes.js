import express from "express";
import { nanoid } from "nanoid";
import redis from "../utils/redis.js";
import { getNow } from "../utils/time.js";
import { safeISO } from "../utils/date.js";

const router = express.Router();


router.post("/pastes", async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (max_views !== undefined && Number(max_views) < 1) {
    return res.status(400).json({ error: "Invalid max views" });
  }

  const ttl =
    ttl_seconds !== undefined ? Number(ttl_seconds) : null;

  if (ttl !== null && (!Number.isInteger(ttl) || ttl < 1)) {
    return res.status(400).json({ error: "Invalid ttl" });
  }

  const id = nanoid();
  const now = getNow(req);

  const paste = {
    content,
    created_at: now,
    expires_at: ttl ? now + ttl * 1000 : null,
    max_views:
      max_views !== undefined ? Number(max_views) : null,
    views: 0,
  };


if (ttl) {
  await redis.set(
    `paste:${id}`,
    JSON.stringify(paste),
    "PX",
    ttl * 1000
  );
} else {
  await redis.set(`paste:${id}`, JSON.stringify(paste));
}


  res.json({
    id,
    url: `${req.protocol}://${req.get("host")}/p/${id}`,
  });
});


router.get("/pastes/:id", async (req, res) => {
  const key = `paste:${req.params.id}`;
  const raw = await redis.get(key);

  if (!raw) {
    return res.status(404).json({ error: "Not found" });
  }

  const paste = JSON.parse(raw);
  const now = getNow(req);


  if (
    paste.expires_at !== null &&
    Number.isFinite(paste.expires_at) &&
    now >= paste.expires_at
  ) {
    return res.status(404).json({ error: "Expired" });
  }


  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return res.status(404).json({ error: "View limit exceeded" });
  }

  paste.views += 1;
  await redis.set(key, JSON.stringify(paste));

  res.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null
        ? null
        : paste.max_views - paste.views,
    expires_at: safeISO(paste.expires_at),
  });
});

export default router;
