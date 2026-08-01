import { createOrderService } from "../services/orderService.js";
import { createOrderSchema } from "../validators/orderValidator.js";

export async function placeOrder(req, res) {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const order = await createOrderService(req.user.id, validatedData);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}
