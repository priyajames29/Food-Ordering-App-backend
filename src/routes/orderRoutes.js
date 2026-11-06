import express from "express";
import { Roles } from "../constants/roles.js";
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
  authorizeRole(Roles.CUSTOMER, Roles.ADMIN),
  validateRequest(createOrderSchema),
  placeOrder,
);

orderRoutes.get(
  "/",
  authenticateUser,
  authorizeRole(Roles.CUSTOMER, Roles.ADMIN, Roles.RESTAURANT_OWNER),
  getOrders,
);

orderRoutes.get(
  "/:id",
  authenticateUser,
  authorizeRole(Roles.CUSTOMER, Roles.ADMIN),
  getOrderById,
);

export default orderRoutes;
