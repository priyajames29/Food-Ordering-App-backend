import express from "express";
import {
  getUsers,
  createUserController,
  getUserFromIdController,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

export const userRoutes = express.Router();

userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUserFromIdController);

userRoutes.post("/", createUserController);
userRoutes.put("/:id", updateUser);

userRoutes.delete("/:id", deleteUser);

export default userRoutes;
