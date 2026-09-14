import z, { email } from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().nonempty(),
  password: z.string().nonempty(),
  role: z.enum(["customer", "restaurant_owner", "admin"]),
});
