import express from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  getOrderById,
  getOrders,
  placeOrder,
} from "../controllers/orderController.js";
import { createOrderSchema } from "../validators/orderValidator.js";

const orderRoutes = express.Router();

orderRoutes.post(
  "/",
  authenticateUser,
  authorizeRole("customer", "admin"),
  validateRequest(createOrderSchema),
  placeOrder,
);

orderRoutes.get(
  "/",
  authenticateUser,
  authorizeRole("customer", "admin"),
  getOrders,
);

orderRoutes.get(
  "/:id",
  authenticateUser,
  authorizeRole("customer", "admin"),
  getOrderById,
);

export default orderRoutes;
