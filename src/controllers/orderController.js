import {
  createOrderService,
  getOrderByIdService,
  getOrdersService,
} from "../services/orderService.js";

export async function placeOrder(req, res) {
  try {
    const order = await createOrderService(req.user.id, req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

export async function getOrders(req, res) {
  try {
    const orders = await getOrdersService();
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await getOrderByIdService(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.user.role !== "admin" && order.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}
