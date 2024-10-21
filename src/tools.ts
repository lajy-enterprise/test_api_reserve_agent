import axios from "axios";
import { object, z } from "zod";
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
  ({ nombre, dni, turn }) => {
    const turnos_disponibles: { [key: string]: string[] } = {
      lunes: ["10:00", "11:00", "12:00"],
      martes: ["10:00", "11:00", "12:00"],
    };
    let response = "";
    for (const turno in turnos_disponibles) {
      turnos_disponibles[turno].forEach((element: string) => {
        if (element === turn) {
          response = `Turno reservado para ${nombre} con DNI ${dni} el día ${turno} a las ${turn}`;
          return;
        }
      });
    }

    if (response === "") {
      return `El turno ${turn} no está disponible, por favor elige otro`;
    } else {
      return response;
    }
  },
  {
    name: "reservacion_de_turno_para_crossfit",
    description:
      "Reserva un nuevo turno para la clase de crossfit, debe proveer nombre, dni y turno",
    schema: z.object({
      nombre: z
        .string()
        .describe("El nombre de la persona que quiere reservar el turno"),
      dni: z
        .string()
        .describe("El dni de la persona que quiere reservar el turno"),
      turn: z
        .string()
        .describe(
          "El turno que quiere reservar, el formato es del tipo hh:mm , no es válido otro formato, siempre hora en punto"
        ),
    }),
  }
);

export const search = tool(
  (_) => {
    return "Hay sol en la plata, ve por la sombra";
  },
  {
    name: "search",
    description: "Llama para navegar por la web.",
    schema: z.string(),
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
export const consultDisponibilidad = tool(
  ({ day, activityQuery }: { day: string; activityQuery: string }) => {
    if (!semana.includes(day)) {
      return "El día ingresado no es válido, por favor ingrese un día de la semana de lunes a viernes";
    }
    if (!activities.some((activity) => activity.includes(activityQuery))) {
      return "La actividad ingresada no es válida, por favor ingrese una actividad válida como crossfit, full body, functional, fit box, woman strong, high intensity";
    }

    const isDisponible = grilla.map((week) => {
      if (week[0]?.activity?.includes(activityQuery)) {
        const horarios: { [key: string]: { [key: string]: string[] } } =
          week[1] as any;
        const dayOfWeek = horarios[day];
        for (const hour in dayOfWeek) {
          const isDisponible = dayOfWeek[hour].some((turno) => turno);
          if (isDisponible) {
            return "Hay Disponibilidad en el horario " + hour;
          }
        }
        return "No hay disponibilidad en el día seleccionado";
        // Add your logic here
      }
    });

    return isDisponible;
  },
  {
    name: "crea_el_detalle_de_la_consulta",
    description:
      "Crea el detalle de la consulta del usuario, para buscar disponibilidad de turnos en base a la actividad y el día",
  }
);
