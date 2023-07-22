import express from "express";
import { check } from "express-validator";
import fileUpload from "../middleware/fileUpload.js";
import {
  create,
  getAlbumById,
  getAlbumsByArtistId,
} from "../controller/albums.js";

const router = express.Router();

router.post(
  "/create",
  fileUpload.fields([{ name: "songFiles" }, { name: "coverImage" }]),
  [
    check("title").not().isEmpty(),
    check("songs").not().isEmpty(),
    check("type").not().isEmpty(),
    check("artist").not().isEmpty(),
  ],
  create
);

router.get("/:albumId", getAlbumById);
router.get("/artist/:artistId", getAlbumsByArtistId);

export default router;
