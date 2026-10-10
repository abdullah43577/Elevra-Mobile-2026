import {
  EDUCATIONAL_DEGREES,
  EDUCATIONAL_FIELDS,
} from "@/schemas/resume-builder/resume-builder";

/*
  Degree and field hold either a picker value ("bachelor_degree") or free text
  as written on an imported resume ("B.Eng"). Anything not in the picker list is
  shown exactly as stored.

  Both the on-screen template and the PDF export used to print the raw value,
  so an exported resume read "bachelor_degree, computer_science" — to a
  recruiter and to every applicant tracking system that parsed it.
*/
export const degreeLabel = function (value?: string) {
  if (!value) return "";
  return EDUCATIONAL_DEGREES.find((degree) => degree.value === value)?.label ?? value;
};

export const fieldLabel = function (value?: string) {
  if (!value) return "";
  return EDUCATIONAL_FIELDS.find((field) => field.value === value)?.label ?? value;
};
