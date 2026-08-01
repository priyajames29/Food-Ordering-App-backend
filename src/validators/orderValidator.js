import z from "zod";

export const createOrderSchema = z.object({
  restaurantId: z.number(),
  items: z
    .array(
      z.object({
        menuItemId: z.number(),
        quantity: z.number().min(1),
      }),
    )
    .min(1),
});
