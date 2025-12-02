import { z } from "zod"

// Volunteer Registration Schema
export const volunteerRegistrationSchema = z.object({
  // Bio-Data Section
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.enum(["Male", "Female", "Other"], { errorMap: () => ({ message: "Please select a gender" }) }),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date)
    const age = new Date().getFullYear() - dob.getFullYear()
    return age >= 18
  }, "You must be at least 18 years old"),
  phone: z.string().regex(/^\+251\d{9}$/, "Phone must be in format +251XXXXXXXXX"),
  email: z.string().email("Invalid email address"),
  education: z.enum(["High School", "Bachelor", "Master", "PhD", "Other"]),
  region: z.string().min(1, "Please select a region"),
  zone: z.string().min(1, "Please select a zone"),
  woreda: z.string().min(1, "Please enter woreda"),

  // Classification Section
  volunteerType: z.enum(["General", "Youth", "Professional", "Specialized", "Other"]),

  // Documents Section
  documents: z.array(z.instanceof(File)).min(1, "Please upload at least one document"),

  // Agreement
  agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to terms and conditions"),
})

export type VolunteerRegistrationFormData = z.infer<typeof volunteerRegistrationSchema>

// Member Registration Schema
export const memberRegistrationSchema = z
  .object({
    // Bio-Data Section
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    memberType: z.enum(["Individual", "Family", "Institutional"]),

    // Conditional fields for Individual
    gender: z.enum(["Male", "Female", "Other"]).optional(),
    dateOfBirth: z.string().optional(),

    // Conditional fields for Family
    numberOfMembers: z.number().min(2).max(20).optional(),

    // Conditional fields for Institutional
    organizationName: z.string().optional(),
    organizationDetails: z.string().optional(),

    // Common fields
    phone: z.string().regex(/^\+251\d{9}$/, "Phone must be in format +251XXXXXXXXX"),
    email: z.string().email("Invalid email address"),
    education: z.enum(["High School", "Bachelor", "Master", "PhD", "Other"]).optional(),
    region: z.string().min(1, "Please select a region"),
    zone: z.string().min(1, "Please select a zone"),
    woreda: z.string().min(1, "Please enter woreda"),

    // Documents Section
    documents: z.array(z.instanceof(File)).min(1, "Please upload at least one document"),

    // Agreement
    agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to terms and conditions"),
  })
  .refine(
    (data) => {
      if (data.memberType === "Individual") {
        return data.gender && data.dateOfBirth
      }
      if (data.memberType === "Family") {
        return data.numberOfMembers
      }
      if (data.memberType === "Institutional") {
        return data.organizationName && data.organizationDetails
      }
      return true
    },
    { message: "Please fill in all required fields for your member type" },
  )

export type MemberRegistrationFormData = z.infer<typeof memberRegistrationSchema>
