import express from "express";
import { check } from "express-validator";
const router = express.Router();
import fileUpload from "../middleware/fileUpload.js";
import { create, get } from "../controller/artists.js";

router.post(
  "/create",
  fileUpload.single("artistImage"),
  [check("name").not().isEmpty(), check("description").not().isEmpty()],
  create
);

router.get("/:artistId",  get);

export default router;
