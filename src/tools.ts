import axios from "axios";
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { horariosCrossfit } from "./mockup_grilla_horaria/mockup_grilla";

// Define the task creation tool
export const createTaskTool = tool(
  async ({ title, description, email }) => {
    const headers = {
      "x-payman-api-secret": process.env.PAYMAN_API_SECRET, // Environment variable for API secret
      "Content-Type": "application/json",
      Accept: "application/vnd.payman.v1+json",
    };

    const payload = {
      title: title, // Task title (e.g., drink name)
      description: description, // Task description (e.g., how to make the drink)
      payout: 5000, // $50 payout in cents
      inviteEmails: [email], // List of emails to invite to complete the task
    };

    try {
      // Choose between sandbox or live environment based on environment variable
      const apiUrl: any = process.env.PAYMAN_DEV_API;

      // Make the API request
      const response = await axios.post(apiUrl, payload, { headers });

      // Return the response content upon success
      return `Task created successfully: ${response.data.title}`;
    } catch (error: any) {
      // Type assertion for error
      // Handle errors (HTTP errors or general exceptions)
      if (error.response) {
        return `HTTP Error: ${error.response.status} - ${error.response.data.message}`;
      } else {
        return `Error: ${error.data}`;
      }
    }
  },
  {
    name: "createTask",
    description:
      "Create a new task on the Payman platform with a title, description, and invited email.",
    schema: z.object({
      title: z
        .string()
        .describe(
          "The title of the task. Make it clear, concise, and to the point."
        ),
      description: z
        .string()
        .describe(
          "The description of the task. Be as detailed as possible as the human will use this to complete the task."
        ),
      email: z
        .string()
        .email()
        .describe("The email of the person to invite to complete the task."),
    }),
  }
);

export const reserveTurnToCrossfit = tool(
  async ({ dia, dni, hora, activity }) => {
    try {
      const response = await fetch("http://localhost:3000/reserve/addReserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          day: dia,
          userId: dni,
          hour: hora,
        }),
      });

      if (response.status === 200) {
        const { message } = await response.json();
        return { message };
      }
    } catch (error) {
      return { error: error, message: "Error al crear la reserva" };
    }

    // return `Turno reservado para ${nombre} con DNI ${dni} a las ${turn}`;
    // if (response === "") {
    //   return `El turno ${turn} no está disponible, por favor elige otro`;
    // } else {
    //   return response;
    // }
  },
  {
    name: "reservacion_de_turno_para_crossfit",
    description:
      "LLamar despues de haber consultado disponibilidad para reserva un nuevo turno para la clase, debe proveer dia, dni y hora",
    schema: z.object({
      dia: z.string().describe("El día de la semana que quieres reservar"),
      dni: z
        .string()
        .describe("El dni de la persona que quiere reservar el turno"),
      activity: z.string().describe("La actividad que quieres reservar"),
      hora: z
        .string()
        .describe(
          "la hora del turno que quiere reservar, el formato es del tipo hh:mm , no es válido otro formato, siempre hora en punto"
        ),
    }),
  }
);

const semana = ["lunes", "martes", "miercoles", "jueves", "viernes"];
const activities = [
  "crossfit",
  "full body",
  "fit box",
  "woman strong",
  "high intensity",
  "functional",
];

const grilla = [horariosCrossfit];

// Esta consulta deberia ser bien estructurada para hacerla en la base de datos
export const consultDisponibilidad = tool(
  ({ day, activityQuery }: { day: string; activityQuery: string }) => {
    if (!semana.includes(day)) {
      return "El día ingresado no es válido, por favor ingrese un día de la semana de lunes a viernes";
    }
    if (
      !activities.some((activity) =>
        activity.toLowerCase().includes(activityQuery.toLowerCase())
      )
    ) {
      return "La actividad ingresada no es válida, por favor ingrese una actividad válida como crossfit, full body, functional, fit box, woman strong, high intensity";
    }
    let isDisponible: any = [];
    grilla.map((week) => {
      if (week[0]?.activity?.includes(activityQuery)) {
        const horarios: { [key: string]: { [key: string]: any[] } } =
          week[1] as any;
        const dayOfWeek = horarios[day];
        let hourDisponibles = [];
        for (const hour in dayOfWeek) {
          const isDisponibleTurn = dayOfWeek[hour].some((turno) => turno);
          hourDisponibles.push({ [hour]: isDisponibleTurn });
        }
        isDisponible = [...hourDisponibles];
        // Add your logic here
      }
    });

    // if (isDisponible) {
    //   return `Hay turnos disponibles para ${activityQuery} el día ${day}`;
    // } else {
    //   return `No hay turnos disponibles para ${activityQuery} el día ${day}`;
    // }
    console.log({ respuesta: isDisponible });

    return JSON.stringify(isDisponible);
  },
  {
    name: "consulta_disponibilidad_de_turno",
    description:
      "Consulta la disponibilidad de un turno para una actividad en un día de la semana cuando el usuario quiere reservar un turno",
    schema: z.object({
      day: z.string().describe("El día de la semana que quieres consultar"),
      activityQuery: z
        .string()
        .describe("La actividad que quieres consultar disponibilidad"),
    }),
  }
);

// Tool para reservar un turno por usuario apunta a un endpoint

export const addReserveTurnTool = tool(
  async ({ dni, dia, hora, activity }) => {
    try {
      const response = await fetch("http://localhost:3000/reserve/addReserve", {
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

      if (response.status === 200) {
        const { message, id } = await response.json();
        return { message, id };
      }
      return "Reserva creada con éxito";
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
      dia: z.string().describe("El día de la semana que quieres reservar"),
      hora: z.string().describe("La hora que quieres reservar"),
      activity: z.string().describe("La actividad que quieres reservar"),
    }),
  }
);
