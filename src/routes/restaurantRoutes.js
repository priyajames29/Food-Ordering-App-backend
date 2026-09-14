import express from "express";
import {
  createRestaurantController,
  deleteRestaurant,
  getRestaurantFromIdController,
  getRestaurants,
} from "../controllers/restaurantCountroller.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createRestaurantSchema } from "../validators/restrauntValidator.js";

const restaurantRoutes = express.Router();

restaurantRoutes.get("/", getRestaurants);
restaurantRoutes.get("/:id", getRestaurantFromIdController);

restaurantRoutes.post(
  "/",
  authenticateUser,
  authorizeRole("restaurant_owner", "admin"),
  validateRequest(createRestaurantSchema),
  createRestaurantController,
);

restaurantRoutes.delete("/:id", deleteRestaurant);

export default restaurantRoutes;
