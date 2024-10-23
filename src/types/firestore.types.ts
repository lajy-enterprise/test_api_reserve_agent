import { z } from "zod";

const UserSchema = z.object({
  userName: z.string().describe("el nombre del usuario."),
  dni: z.string().describe("el dni del usuario."),
  email: z.string().email().describe("el email del usuario."),
});

export type User = z.infer<typeof UserSchema>;
