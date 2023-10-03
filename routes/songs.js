import express from "express";
import { check } from "express-validator";
import { getSongMetadata, search, stream } from "../controller/song.js";

const router = express.Router();

router.get("/:songId", getSongMetadata);

router.post("/search/", [check("searchQuery").not().isEmpty()], search);

router.get("/stream/:songId/:userId", stream);
export default router;
