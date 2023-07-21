import express from "express";
import { check } from "express-validator";
import {
  signin,
  signup,
  get,
  checkUserAccount,
  changeUserPreference,
} from "../controller/users.js";

const router = express.Router();

router.post(
  "/signup",
  [
    check("username").isLength({ min: 6, max: 20 }),
    check("email").not().isEmpty().normalizeEmail().isEmail(),
    check("password").isLength({ min: 8, max: 64 }),
  ],
  signup
);

router.post(
  "/signin",
  [check("username").not().isEmail(), check("password").not().isEmpty()],
  signin
);

router.get("/check", checkUserAccount);
router.get("/", get);
// router.get("/playlists", usersControllers.getPlaylists);
router.patch("/change-preference", changeUserPreference);

export default router;
