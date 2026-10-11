import {
  EDUCATIONAL_DEGREES,
  EDUCATIONAL_FIELDS,
} from "@/schemas/resume-builder/resume-builder";

// Imported resumes store free text, so a value not in the picker shows as stored.
export const degreeLabel = function (value?: string) {
  if (!value) return "";
  return EDUCATIONAL_DEGREES.find((degree) => degree.value === value)?.label ?? value;
};

export const fieldLabel = function (value?: string) {
  if (!value) return "";
  return EDUCATIONAL_FIELDS.find((field) => field.value === value)?.label ?? value;
};
