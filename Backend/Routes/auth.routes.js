import express from "express";
const router = express.Router();
import { registerUser, loginUser, validateToken } from "../Controller/auth.controller.js";
import { check } from "express-validator";
import validateInput from "../Middleware/validate.middleware.js";

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  validateInput,
  registerUser
);

router.post(
  "/login",
  [
    check("email", "email is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
  ],
  validateInput,
  loginUser
);

router.post("/validate-token", validateToken);



export default router;
