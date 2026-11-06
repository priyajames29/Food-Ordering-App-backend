import express from "express";
import { Roles } from "../constants/roles.js";
import {
  createRestaurantController,
  deleteRestaurant,
  getRestaurantFromIdController,
  getRestaurants,
  updateRestaurant,
} from "../controllers/restaurantCountroller.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { checkRestaurantOwnership } from "../middlewares/checkRestaurantOwnership.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createRestaurantSchema } from "../validators/restrauntValidator.js";

const restaurantRoutes = express.Router();

restaurantRoutes.get("/", getRestaurants);
restaurantRoutes.get("/:id", getRestaurantFromIdController);

restaurantRoutes.post(
  "/",
  authenticateUser,
  authorizeRole(Roles.RESTAURANT_OWNER, Roles.ADMIN),
  validateRequest(createRestaurantSchema),
  createRestaurantController,
);

restaurantRoutes.put(
  "/:id",
  authenticateUser,
  authorizeRole(Roles.RESTAURANT_OWNER, Roles.ADMIN),
  checkRestaurantOwnership,
  updateRestaurant,
);

restaurantRoutes.delete(
  "/:id",
  authenticateUser,
  authorizeRole(Roles.RESTAURANT_OWNER, Roles.ADMIN),
  checkRestaurantOwnership,
  deleteRestaurant,
);

export default restaurantRoutes;
