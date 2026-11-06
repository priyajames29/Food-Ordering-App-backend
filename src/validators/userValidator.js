import z, { email } from "zod";
import { ROLE_VALUES } from "../constants/roles.js";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.email().nonempty(),
  password: z.string().nonempty(),
  role: z.enum(ROLE_VALUES),
});
