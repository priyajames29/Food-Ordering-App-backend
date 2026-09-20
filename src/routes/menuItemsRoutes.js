import express from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import {
  createMenuItem,
  getMenuItems,
  getMenuItemsRestaurant,
} from "../controllers/menuItemsController.js";

const menuItemsRoutes = express.Router();

menuItemsRoutes.get("/", getMenuItems);

menuItemsRoutes.get("/:restaurantId", getMenuItemsRestaurant);

menuItemsRoutes.post(
  "/",
  authenticateUser,
  authorizeRole("restaurant_owner", "admin"),
  createMenuItem,
);

export default menuItemsRoutes;
