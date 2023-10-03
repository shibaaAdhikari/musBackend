import express from "express";
import { check } from "express-validator";
import { getPlaylist, create, add } from "../controller/playlists";

const router = express.Router();

router.get("/:playlistId", getPlaylist);

router.post(
  "/create",
  [check("name").not().isEmpty(), check("description").not().isEmpty()],
  create
);

router.post(
  "/add",
  [check("songId").not().isEmpty(), check("playlistId").not().isEmpty()],
  add
);

export default router;
