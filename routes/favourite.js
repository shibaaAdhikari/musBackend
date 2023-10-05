import express from "express";
import { create, remove,display } from "../controller/favourites.js";

const router = express.Router();

router.post("/addtofavourites/:songId",create);
router.delete("/removefromfavourites",remove);
router.post("/displayfavourites",display);

export default router;
