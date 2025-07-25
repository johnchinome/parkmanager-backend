import express from "express";
import { login } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema } from "../validations/user.validation.js";

const router = express.Router();

router.post("/login", validate(loginSchema), login);

export default router;
