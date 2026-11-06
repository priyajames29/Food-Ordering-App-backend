import express from "express";
import { Roles } from "../constants/roles.js";
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

userRoutes.get("/", authenticateUser, authorizeRole(Roles.ADMIN), getUsers);
userRoutes.get(
  "/:id",
  authenticateUser,
  authorizeRole(Roles.ADMIN),
  getUserFromIdController,
);

userRoutes.put(
  "/:id",
  authenticateUser,
  authorizeRole(true, Roles.ADMIN),
  updateUser,
);

userRoutes.delete(
  "/:id",
  authenticateUser,
  authorizeRole(Roles.ADMIN),
  deleteUser,
);

export default userRoutes;
