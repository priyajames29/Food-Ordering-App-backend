import z from "zod";

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
