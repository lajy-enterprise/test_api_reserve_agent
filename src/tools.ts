import { grillaHoraria } from "./mockup_grilla_horaria/mockup_grilla.ts";
import { BASE_URL } from "./server.ts";
import { z } from "zod";
import { tool } from "@langchain/core/tools";

const activities = [
  "crossfit",
  "full body",
  "fit box",
  "woman strong",
  "high intensity",
  "functional",
];

export const consultDisponibilidad = tool(
  async ({
    day,
    activityQuery,
    hour,
  }: {
    day: string;
    activityQuery: string;
    hour: string;
  }) => {
    const activityFound = activities.find((activity) => {
      const actiSplitter = activity.toLowerCase().replace(/\s+/g, "");
      const actiQuerySplitter = activityQuery.toLowerCase().replace(/\s+/g, "");
      return actiSplitter === actiQuerySplitter;
    });

    if (!activityFound) {
      return "La actividad ingresada no es válida, por favor ingrese una actividad válida como crossfit, full body, functional, fit box, woman strong, high intensity";
    }

    if (day.includes("Sun")) {
      return `No hay turnos disponibles para los dias domingo`;
    }

    const hours = Object.keys(grillaHoraria);
    if (!hours.includes(hour)) {
      return "No es un horario válido, recuerda que estamos de 7 a 22 hs";
    }

    try {
      const response = await fetch(`${BASE_URL}/reserve/getDisponibility`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          day,
          activityQuery: activityFound,
          hour,
        }),
      });

      const res = await response.json();
      return { message: res.message };
    } catch (error) {
      return { message: error };
    }
  },
  {
    name: "consulta_disponibilidad_de_turno",
    description:
      "Consulta la disponibilidad de un turno para una actividad en un día de la semana cuando el usuario quiere reservar un turno",
    schema: z.object({
      day: z
        .string()
        .date()
        .describe(
          "El día de la semana que quieres consultar en formato yyyy-mm-dd"
        ),
      activityQuery: z
        .string()
        .describe("La actividad que quieres consultar disponibilidad"),
      hour: z.string().time().describe("La hora que quieres reservar"),
    }),
  }
);

// Tool para reservar un turno por usuario apunta a un endpoint

export const addReserveTurnTool = tool(
  async ({ dni, dia, hora, activity, confirm }) => {
    console.log("addReserveTurnTool, la confirmacion es: ", confirm);
    if (!confirm) return { message: "Reserva cancelado por el usuario" };
    try {
      const response = await fetch(`${BASE_URL}/reserve/addReserve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: dni,
          day: dia,
          hour: hora,
          activity,
        }),
      });

      const { message, id } = await response.json();
      return { message, id };
    } catch (error) {
      return { error: error, message: "Error al crear la reserva" };
    }
  },
  {
    name: "addReserveTurn",
    description:
      "Reservar un turno para el usuario con dia, hora y actividad, llamar a esta funcion luego de haber consultado disponibilidad",
    schema: z.object({
      dni: z
        .string()
        .length(8)
        .describe("El id del usuario que quiere reservar"),
      dia: z
        .string()
        .date()
        .describe(
          "El día de la semana que quieres reservar en formato yyyy-mm-dd"
        ),
      hora: z.string().time().describe("La hora que quieres reservar"),
      activity: z.string().describe("La actividad que quieres reservar"),
      confirm: z.boolean().describe("Confirmacion de la reserva"),
    }),
  }
);
