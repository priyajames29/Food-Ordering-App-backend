import z from "zod";

export const createRestaurantSchema = z.object({
  name: z.string().nonempty(),
  location: z.string().nonempty(),
  phone: z.string().length(9),
  openingTime: z.string().nonempty(),
  closingTime: z.string().nonempty(),
});
