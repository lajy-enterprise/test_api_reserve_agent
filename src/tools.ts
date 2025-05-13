import { z } from 'zod'
import { tool } from '@langchain/core/tools'

export const checkProducts = tool(
  async ({ day, activityQuery, hour }) => {
    try {
      return { message: res.message }
    } catch (error) {
      return { message: error }
    }
  },
  {
    name: 'check_products',
    description:
      'Consulta la disponibilidad de un turno para una actividad en un día de la semana cuando el usuario quiere reservar un turno',
    schema: z.object({
      day: z
        .string()
        .date()
        .describe(
          'El día de la semana que quieres consultar en formato yyyy-mm-dd',
        ),
      activityQuery: z
        .string()
        .describe('La actividad que quieres consultar disponibilidad'),
      hour: z
        .string()
        .time()
        .describe('La hora que quieres reservar en formato: HH:MM:SS'),
    }),
  },
)
