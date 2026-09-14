import { createOrderService } from "../services/orderService.js";

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
