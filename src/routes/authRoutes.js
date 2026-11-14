import express from "express";
import {
  createUserController,
  getLoginUser,
} from "../controllers/userController.js";
import { createUserSchema } from "../validators/userValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { authLimiter } from "../config/rateLimiter.js";

const authRoutes = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
authRoutes.post("/login", authLimiter, getLoginUser);
authRoutes.post(
  "/register",
  validateRequest(createUserSchema),
  createUserController,
);

export default authRoutes;
