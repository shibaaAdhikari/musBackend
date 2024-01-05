import express from "express";
import { check } from "express-validator";
import { signupUser, loginUser} from "../controller/account.js";
const router = express.Router();

router.post(
  "/signup",
//   [
//     check("username").isLength({ min: 6, max: 20 }),
//     check("email").not().isEmpty().normalizeEmail().isEmail(),
//     check("password").not().isEmpty(),
//   ],
  signupUser
);

router.post(
  "/signin",
  [check("username").not().isEmail(), check("password").not().isEmpty()],
  loginUser
);

export default router;
