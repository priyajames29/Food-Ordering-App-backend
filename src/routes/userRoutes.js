import express from "express";
import {
  getUsers,
  createUserController,
  getUserFromIdController,
  updateUser,
  deleteUser,
  getLoginUser,
} from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUserFromIdController);

userRoutes.post("/login", getLoginUser);
userRoutes.post("/", createUserController);
userRoutes.put("/:id", updateUser);

userRoutes.delete("/:id", deleteUser);

export default userRoutes;
