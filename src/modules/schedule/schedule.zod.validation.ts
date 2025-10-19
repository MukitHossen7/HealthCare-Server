import { z } from "zod";

export const createScheduleZodSchema = z.object({
  startDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Invalid startDate format (expected YYYY-MM-DD)"
    ),
  endDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Invalid endDate format (expected YYYY-MM-DD)"
    ),
  startTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Invalid startTime format (expected HH:MM)"
    ),
  endTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Invalid endTime format (expected HH:MM)"
    ),
});
