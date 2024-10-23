import { z } from "zod";

const reserveSchema = z.object({
  dni: z
    .string()
    .length(8)
    .describe(
      "El DNI del cliente, ejemplo: 25489679 , no debe contener puntos ni guiones."
    ),
  activity: z.string().describe("La actividad a reservar, ejemplo: Crossfit"),
  horaDeReserva: z
    .string()
    .refine((time) => {
      // Validación básica de formato 'HH:mm'
      return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
    })
    .describe("La hora de la reserva en fomrato hh:mm, ejemplo: 15:00"),
  diaDeLaReserva: z
    .string()
    .refine((date) => {
      // Validación básica de formato 'YYYY-MM-DD'
      return /^\d{4}-\d{2}-\d{2}$/.test(date);
    })
    .describe(
      "El dia de la reserva, ejemplo: 25 , no debe contener puntos ni guiones."
    ),
});

export type Reserve = z.infer<typeof reserveSchema>;
