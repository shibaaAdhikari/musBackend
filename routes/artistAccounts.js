import express from "express";
import { check } from "express-validator";
import { signup, signin, artists } from "../controller/artistAccounts.js";
const router = express.Router();

router.post(
  "/signup",
  [
    check("username").isLength({ min: 6, max: 20 }),
    check("email").not().isEmpty().normalizeEmail().isEmail(),
    check("password").not().isEmpty(),
  ],
  signup
);

router.post(
  "/signin",
  [check("username").not().isEmail(), check("password").not().isEmpty()],
  signin
);

router.get("/artists", artists);

export default router;
