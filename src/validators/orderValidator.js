import z from "zod";
import { ORDER_STATUS_VALUES } from "../constants/orderStatus.js";

export const createOrderSchema = z.object({
  restaurantId: z.number(),
  items: z
    .array(
      z.object({
        menuItemId: z.number(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUS_VALUES),
});
