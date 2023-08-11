import express from "express";
import { check } from "express-validator";
import fileUpload from "../middleware/fileUpload.js";
import { create, getAlbumById, getAlbums } from "../controller/albums.js";

const router = express.Router();

router.post(
  "/create",
  fileUpload.fields([
    { name: "songFiles", maxCount: 10 },
    { name: "coverImage", maxCount: 1 },
  ]),
  [
    check("title").not().isEmpty(),
    check("songs").not().isEmpty(),
    check("type").not().isEmpty(),
    check("artist").not().isEmpty(),
  ],
  create
);

router.get("/:albumid", getAlbumById);
router.get("/albums", getAlbums);

export default router;
