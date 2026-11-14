import express from "express";
import {
  createUserController,
  getLoginUser,
} from "../controllers/userController.js";
import { createUserSchema } from "../validators/userValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { authLimiter } from "../config/rateLimiter.js";

const authRoutes = express.Router();

authRoutes.post("/login", authLimiter, getLoginUser);
authRoutes.post(
  "/register",
  validateRequest(createUserSchema),
  createUserController,
);

export default authRoutes;
