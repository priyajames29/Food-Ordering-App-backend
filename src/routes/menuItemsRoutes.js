import express from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItems,
  getMenuItemsRestaurant,
  updateMenuItem,
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

menuItemsRoutes.put(
  "/:id",
  authenticateUser,
  authorizeRole("restaurant_owner", "admin"),
  updateMenuItem,
);

menuItemsRoutes.delete(
  "/:id",
  authenticateUser,
  authorizeRole("restaurant_owner", "admin"),
  deleteMenuItem,
);

export default menuItemsRoutes;
