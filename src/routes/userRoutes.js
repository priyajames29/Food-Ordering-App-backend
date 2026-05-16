import express from "express"
import {getUsers, createUserController} from "../controllers/userController.js"

export const userRoutes = express.Router();

userRoutes.get('/', getUsers);
userRoutes.post('/', createUserController);

export default userRoutes
