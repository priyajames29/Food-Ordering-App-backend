import express from "express";
import {
  createUserController,
  getLoginUser,
} from "../controllers/userController.js";
import { createUserSchema } from "../validators/userValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const authRoutes = express.Router();

authRoutes.post("/login", getLoginUser);
authRoutes.post(
  "/register",
  validateRequest(createUserSchema),
  createUserController,
);

export default authRoutes;
