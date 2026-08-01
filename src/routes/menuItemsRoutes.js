import express from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { createMenuItem } from "../controllers/menuItemsController.js";

const menuItems = express.Router();

menuItems.post(
  "/",
  authenticateUser,
  authorizeRole("restaurant_owner", "admin"),
  createMenuItem,
);

export default menuItems;
