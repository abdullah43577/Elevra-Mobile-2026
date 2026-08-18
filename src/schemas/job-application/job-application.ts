import z from "zod";

const optionalNumericString = z
  .string()
  .optional()
  .refine((value) => !value || /^\d+$/.test(value.trim()), "Enter numbers only");

export const jobApplicationSchema = z
  .object({
    company: z.string().min(1, "Company is required"),
    role: z.string().min(1, "Role is required"),
    location: z.string().optional(),
    workArrangement: z
      .enum(["ONSITE", "HYBRID", "REMOTE"])
      .nullable()
      .optional(),
    jobUrl: z
      .string()
      .optional()
      .refine(
        (value) => !value || /^https?:\/\/.+/.test(value.trim()),
        "Enter a full URL starting with http",
      ),
    source: z.string().optional(),
    salaryMin: optionalNumericString,
    salaryMax: optionalNumericString,
    salaryCurrency: z
      .string()
      .optional()
      .refine(
        (value) => !value || value.trim().length === 3,
        "Use a 3-letter code, e.g. USD",
      ),
    status: z.enum([
      "SAVED",
      "APPLIED",
      "INTERVIEWING",
      "OFFER",
      "REJECTED",
      "WITHDRAWN",
    ]),
    notes: z.string().optional(),
    jobDescription: z.string().optional(),
    resumeId: z.string().nullable().optional(),
    coverLetterId: z.string().nullable().optional(),
  })
  .refine(
    (values) => {
      if (!values.salaryMin || !values.salaryMax) return true;
      return Number(values.salaryMin) <= Number(values.salaryMax);
    },
    { message: "Minimum cannot exceed maximum", path: ["salaryMax"] },
  );

export type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;
