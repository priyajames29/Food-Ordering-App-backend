import express from "express";
import { Roles } from "../constants/roles.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItems,
  getMenuItemsRestaurant,
  getTopMenuItemsController,
  updateMenuItem,
} from "../controllers/menuItemsController.js";

const menuItemsRoutes = express.Router();

menuItemsRoutes.get("/", getMenuItems);

menuItemsRoutes.get("/top", getTopMenuItemsController);

menuItemsRoutes.get("/:restaurantId", getMenuItemsRestaurant);

menuItemsRoutes.post(
  "/",
  authenticateUser,
  authorizeRole(Roles.RESTAURANT_OWNER, Roles.ADMIN),
  createMenuItem,
);

menuItemsRoutes.put(
  "/:id",
  authenticateUser,
  authorizeRole(Roles.RESTAURANT_OWNER, Roles.ADMIN),
  updateMenuItem,
);

menuItemsRoutes.delete(
  "/:id",
  authenticateUser,
  authorizeRole(Roles.RESTAURANT_OWNER, Roles.ADMIN),
  deleteMenuItem,
);

export default menuItemsRoutes;
