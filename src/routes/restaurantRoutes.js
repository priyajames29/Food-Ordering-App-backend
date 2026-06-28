import express from "express";
import {
  createRestaurantController,
  deleteRestaurant,
  getRestaurantFromIdController,
  getRestaurants,
} from "../controllers/restaurantCountroller.js";

const restaurantRoutes = express.Router();

restaurantRoutes.get("/", getRestaurants);
restaurantRoutes.get("/:id", getRestaurantFromIdController);

restaurantRoutes.post("/", createRestaurantController);

restaurantRoutes.delete("/:id", deleteRestaurant);

export default restaurantRoutes;
