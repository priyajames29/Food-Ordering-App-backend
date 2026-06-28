import z, { email } from "zod";

export const createRestaurantSchema = z.object({
  name: z.string(),
  location: z.string(),
});
