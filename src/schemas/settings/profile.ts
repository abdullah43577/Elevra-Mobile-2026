import z from "zod";

export const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
