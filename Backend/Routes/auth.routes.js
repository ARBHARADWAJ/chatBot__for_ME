import express from "express";
import { registerUser, loginUser } from "../Controller/auth.controller.js";
const router=express.Router();
import { check } from "express-validator";
import validateInput from "../Middleware/validate.middleware.js";



router.post("/register",[
check("name", "Name is required").not().isEmpty(),
check("email", "Email is required").isEmail(),
check("password", "Password must be at least 6 characters").isLength({ min:6}),
],validateInput,registerUser);


router.post("/login",[
check("email","email is required").not().isEmpty(),
check("password","Password is required").not().isEmpty(),
],validateInput,loginUser);





export default router;
