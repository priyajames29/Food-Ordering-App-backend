import express from "express";
import { Roles } from "../constants/roles.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  getOrderById,
  getOrders,
  placeOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validators/orderValidator.js";

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

orderRoutes.patch(
  "/:id/status",
  authenticateUser,
  authorizeRole(Roles.CUSTOMER, Roles.ADMIN, Roles.RESTAURANT_OWNER),
  validateRequest(updateOrderStatusSchema),
  updateOrderStatus,
);

export default orderRoutes;
