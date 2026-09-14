import express from "express";
import {
  getUsers,
  createUserController,
  getUserFromIdController,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const userRoutes = express.Router();

userRoutes.get("/", authenticateUser, authorizeRole("admin"), getUsers);
userRoutes.get(
  "/:id",
  authenticateUser,
  authorizeRole("admin"),
  getUserFromIdController,
);

userRoutes.put("/:id", authenticateUser, updateUser);

userRoutes.delete("/:id", authenticateUser, authorizeRole("admin"), deleteUser);

export default userRoutes;
