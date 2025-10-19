import z from "zod";

export const createDoctorScheduleZodSchema = z.object({
  scheduleIds: z.array(
    z.string().uuid({ message: "Invalid schedule ID format" })
  ),
});
