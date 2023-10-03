import express from "express";
import { create, remove } from "../controller/favourites.js";

const router = express.Router();

router.post("/addtofavourites",create);
router.post("/removefromfavourites",remove);

export default router;
