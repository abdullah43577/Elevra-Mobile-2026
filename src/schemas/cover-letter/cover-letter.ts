import { z } from "zod";

export const coverLetterSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  recipientName: z.string().optional(),
  recipientTitle: z.string().optional(),
  companyAddress: z.string().optional(),
  body: z.string().min(1, "Write your letter before saving"),
  closing: z.string().optional(),
  // The sender block. Name and email are what actually appear on the letter, so
  // they are required here even though the server accepts a partial.
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    location: z.string().optional(),
    title: z.string().optional(),
  }),
});

export type CoverLetterFormValues = z.infer<typeof coverLetterSchema>;

export const DEFAULT_CLOSING = "Sincerely,";

export const CLOSING_OPTIONS = [
  "Sincerely,",
  "Kind regards,",
  "Best regards,",
  "Yours faithfully,",
];
