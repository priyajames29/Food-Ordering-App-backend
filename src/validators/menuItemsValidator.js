import z from "zod";

export const createMenuItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.float32(),
  category: z.string(),
  isAvailable: z.boolean(),
});
