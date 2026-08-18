import { z } from "zod";

/*
  The smallest amount of career profile that makes prefill worth having. It maps
  straight onto `personalInfo`, which is the one section every resume, cover
  letter and export reads.

  It deliberately does not collect a first job. `experienceSchema` requires a
  start date, which means a date field at the very first screen of the app, and
  the full editor two taps away already does that job properly.
*/
export const quickProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  title: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
});

export type QuickProfileFormValues = z.infer<typeof quickProfileSchema>;
