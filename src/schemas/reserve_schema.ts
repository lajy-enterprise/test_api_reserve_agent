import { z } from "zod";
const diaSemanaSchema = z.enum([
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
]);
const reserveSchema = z.object({
  dni: z
    .string()
    .length(8)
    .describe(
      "El DNI del cliente, ejemplo: 25489679 , no debe contener puntos ni guiones."
    ),
  activity: z.string().describe("La actividad a reservar, ejemplo: Crossfit"),
  hora: z
    .string()
    .refine((time) => {
      // Validación básica de formato 'HH:mm'
      return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
    })
    .describe("La hora de la reserva en fomrato hh:mm, ejemplo: 15:00"),
  dia: diaSemanaSchema.describe(
    "El dia de la reserva, ejemplo: lunes, martes, miércoles, jueves, viernes"
  ),
});

export type Reserve = z.infer<typeof reserveSchema>;
