import { Roles } from "../constants/roles.js";
import {
  createOrderService,
  getAllOrdersService,
  getOrderByIdService,
  getOrdersForCustomerService,
  getOrdersForRestaurantOwnerService,
} from "../services/orderService.js";
import { sendError } from "../utils/errors.js";

export async function placeOrder(req, res) {
  try {
    const order = await createOrderService(req.user.id, req.body);
    res.status(201).json(order);
  } catch (error) {
    sendError(res, error);
  }
}

export async function getOrders(req, res) {
  try {
    const { role, id } = req.user;
    let orders = [];
    if (role === Roles.ADMIN) {
      orders = await getAllOrdersService();
    } else if (role === Roles.RESTAURANT_OWNER) {
      orders = await getOrdersForRestaurantOwnerService(id);
    } else if (role === Roles.CUSTOMER) {
      orders = await getOrdersForCustomerService(id);
    }
    res.status(200).json(orders);
  } catch (error) {
    sendError(res, error);
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await getOrderByIdService(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.user.role !== Roles.ADMIN && order.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(order);
  } catch (error) {
    sendError(res, error);
  }
}
