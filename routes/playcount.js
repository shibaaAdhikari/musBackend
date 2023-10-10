import express from "express";
import { calculateTotalPlayCounts, getTrendingSongs, incrementPlayCount } from "../controller/playcounts.js"; // Import your controllers

const router = express.Router();

// Route to calculate total play counts for all songs
router.get("/play-counts", calculateTotalPlayCounts);

// Route to get trending songs sorted by play counts
router.get("/trending-songs", getTrendingSongs);

// Route to increment the play count for a specific song
router.post("/increment-play-count/:songId", incrementPlayCount);

export default router;
