"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FormField } from "@/components/form-field";
import { ProgressBar } from "@/components/progress-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Upload, MapPin, Briefcase, User, FileText, Globe, Award, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import * as z from "zod";

// Enhanced schema with fields from PDF - FIXED: Updated document field names to match backend
const candidateRegistrationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
  }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  age: z.number().min(18, "Must be at least 18 years old").optional(),
  weight: z.number().min(40, "Weight must be at least 40kg").optional(),
  height: z.number().min(140, "Height must be at least 140cm").optional(),
  placeOfBirth: z.string().min(2, "Place of birth is required"),
  phone: z.string().regex(/^\+251\d{9}$/, "Invalid phone number format (+251XXXXXXXXX)"),
  email: z.string().email("Invalid email address"),
  
  // Marital & Family
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"], {
    required_error: "Marital status is required",
  }),
  numberOfChildren: z.number().min(0, "Must be 0 or more").optional().default(0),
  religion: z.string().min(2, "Religion is required"),
  
  // Passport & Nationality
  nationality: z.string().min(2, "Nationality is required"),
  passportNumber: z.string().min(6, "Passport number is required"),
  passportPlaceIssued: z.string().min(2, "Place issued is required"),
  passportDateIssued: z.string().min(1, "Date issued is required"),
  passportExpiryDate: z.string().min(1, "Expiry date is required"),
  
  // Job Preferences
  positionApplied: z.string().min(2, "Position is required"),
  expectedSalary: z.number().min(1, "Expected salary is required"),
  skills: z.string().min(10, "Please describe your skills (minimum 10 characters)"),
  preferredDestination: z.enum(["Dubai", "Qatar", "Saudi Arabia", "Other"], {
    required_error: "Preferred destination is required",
  }),
  otherDestination: z.string().optional(),
  
  // Language Skills
  arabicProficiency: z.number().min(1).max(10).optional(),
  englishProficiency: z.number().min(1).max(10).optional(),
  otherLanguages: z.string().optional(),
  
  // Previous Employment
  previousEmploymentCountry: z.string().optional(),
  previousEmploymentPeriod: z.string().optional(),
  
  // Skills Checklist (from PDF)
  cleaning: z.boolean().default(false),
  washing: z.boolean().default(false),
  ironing: z.boolean().default(false),
  sewing: z.boolean().default(false),
  babySitting: z.boolean().default(false),
  cooking: z.boolean().default(false),
  arabicCooking: z.boolean().default(false),
  elderlyCare: z.boolean().default(false),
  caregiver: z.boolean().default(false),
  otherSkills: z.string().optional(),
  
  // Documents - FIXED: Updated field names to match backend (with "Path" suffix)
  passportPath: z.any()
    .refine((files) => files && files.length > 0, "Passport copy is required")
    .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, "Max file size is 5MB"),
  photoPath: z.any()
    .refine((files) => files && files.length > 0, "Photo is required")
    .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, "Max file size is 5MB"),
  medicalClearancePath: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= 5 * 1024 * 1024, "Max file size is 5MB"),
  policeClearancePath: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= 5 * 1024 * 1024, "Max file size is 5MB"),
  agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to terms and conditions"),
});

type CandidateRegistrationFormData = z.infer<typeof candidateRegistrationSchema>;

const translations = {
  en: {
    title: "Candidate Registration",
    subtitle: "Complete your profile to find overseas job opportunities",
    personalSection: "Personal Information",
    employmentSection: "Employment Details",
    skillsSection: "Skills & Qualifications",
    documentsSection: "Documents & Agreement",
    
    // Personal Info
    firstName: "First Name",
    lastName: "Last Name",
    gender: "Gender",
    selectGender: "Select gender",
    male: "Male",
    female: "Female",
    other: "Other",
    dateOfBirth: "Date of Birth",
    age: "Age",
    weight: "Weight (kg)",
    height: "Height (cm)",
    placeOfBirth: "Place of Birth",
    phone: "Phone Number",
    phonePlaceholder: "+251912345678",
    email: "Email Address",
    emailPlaceholder: "you@example.com",
    
    // Marital & Family
    maritalStatus: "Marital Status",
    selectMaritalStatus: "Select marital status",
    single: "Single",
    married: "Married",
    divorced: "Divorced",
    widowed: "Widowed",
    numberOfChildren: "Number of Children",
    religion: "Religion",
    
    // Passport & Nationality
    nationality: "Nationality",
    passportNumber: "Passport Number",
    passportPlaceIssued: "Passport Place Issued",
    passportDateIssued: "Passport Date Issued",
    passportExpiryDate: "Passport Expiry Date",
    
    // Job Details
    positionApplied: "Position Applied For",
    expectedSalary: "Expected Salary (USD)",
    skills: "Skills & Experience",
    skillsPlaceholder: "Describe your skills, work experience, and qualifications...",
    
    // Language Skills
    languageProficiency: "Language Proficiency",
    arabicProficiency: "Arabic",
    englishProficiency: "English",
    otherLanguages: "Other Languages",
    otherLanguagesPlaceholder: "List other languages you speak...",
    
    // Previous Employment
    previousEmployment: "Previous Employment Abroad",
    previousEmploymentCountry: "Country",
    previousEmploymentPeriod: "Period",
    na: "N/A",
    
    // Skills Checklist
    skillsChecklist: "Skills Checklist",
    cleaning: "Cleaning",
    washing: "Washing",
    ironing: "Ironing",
    sewing: "Sewing",
    babySitting: "Baby Sitting",
    cooking: "Cooking",
    arabicCooking: "Arabic Cooking",
    elderlyCare: "Elderly Care",
    caregiver: "Caregiver",
    otherSkills: "Other Skills",
    otherSkillsPlaceholder: "Add other skills...",
    
    // Job Preferences
    preferredDestination: "Preferred Destination Country",
    selectDestination: "Select destination country",
    dubai: "Dubai, UAE",
    qatar: "Qatar",
    saudiArabia: "Saudi Arabia",
    others: "Other",
    otherDestinationPlaceholder: "Specify other destination...",
    
    // Documents
    documents: "Upload Documents",
    documentsDesc: "Upload required documents (PDF/JPEG/PNG, max 5MB each)",
    passport: "Passport Copy",
    photo: "Passport Size Photo",
    medicalClearance: "Medical Clearance",
    policeClearance: "Police Clearance Certificate",
    uploadFile: "Click to upload or drag and drop",
    browse: "Browse",
    maxSize: "Max. 5MB",
    agreeToTerms: "I agree to the terms and conditions",
    
    // Steps
    step1: "Personal Info",
    step2: "Skills & Job",
    step3: "Documents",
    
    // Navigation
    previous: "Previous",
    next: "Next",
    submit: "Submit Registration",
    backToSelection: "Back to Selection",
    success: "Registration Successful!",
    successMsg: "Your candidate ID is: {id}. You will be redirected shortly...",
    error: "Registration Failed",
    loading: "Submitting...",
    validationError: "Please fix the errors above",
  },
};

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth: string): number => {
  if (!dateOfBirth) return 0;
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export default function CandidateRegistrationPage() {
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [candidateId, setCandidateId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState<string | null>(null);
  
  // FIXED: Properly type the refs
  const passportRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const medicalRef = useRef<HTMLInputElement>(null);
  const policeRef = useRef<HTMLInputElement>(null);

  const t = translations[language as keyof typeof translations] || translations.en;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
    setValue,
  } = useForm<CandidateRegistrationFormData>({
    resolver: zodResolver(candidateRegistrationSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      dateOfBirth: "",
      age: undefined,
      weight: undefined,
      height: undefined,
      placeOfBirth: "",
      phone: "",
      email: "",
      maritalStatus: undefined,
      numberOfChildren: 0,
      religion: "",
      nationality: "",
      passportNumber: "",
      passportPlaceIssued: "",
      passportDateIssued: "",
      passportExpiryDate: "",
      positionApplied: "",
      expectedSalary: 1000,
      skills: "",
      preferredDestination: undefined,
      otherDestination: "",
      arabicProficiency: undefined,
      englishProficiency: undefined,
      otherLanguages: "",
      previousEmploymentCountry: "",
      previousEmploymentPeriod: "",
      cleaning: false,
      washing: false,
      ironing: false,
      sewing: false,
      babySitting: false,
      cooking: false,
      arabicCooking: false,
      elderlyCare: false,
      caregiver: false,
      otherSkills: "",
      // FIXED: Updated default values to match new field names
      passportPath: [],
      photoPath: [],
      medicalClearancePath: [],
      policeClearancePath: [],
      agreeToTerms: false,
    },
  });

  // Watch form values - FIXED: Updated field names
  const preferredDestination = watch("preferredDestination");
  const passportPath = watch("passportPath");
  const photoPath = watch("photoPath");
  const medicalClearancePath = watch("medicalClearancePath");
  const policeClearancePath = watch("policeClearancePath");
  const agreeToTerms = watch("agreeToTerms");
  const dateOfBirth = watch("dateOfBirth");

  // Calculate age automatically when date of birth changes
  useEffect(() => {
    if (dateOfBirth) {
      const age = calculateAge(dateOfBirth);
      setValue("age", age);
    }
  }, [dateOfBirth, setValue]);

  const handleDrag = (e: React.DragEvent, fieldName: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(fieldName);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, fieldName: keyof CandidateRegistrationFormData) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setValue(fieldName, files);
    }
  };

  const handleFileClick = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const onSubmit = async (data: CandidateRegistrationFormData) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const formData = new FormData();
      
      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        // Skip file fields - they will be appended separately
        if (key.includes('Path')) {
          return;
        }
        
        if (value !== undefined && value !== null) {
          if (typeof value === "boolean") {
            formData.append(key, value.toString());
          } else if (typeof value === "number") {
            formData.append(key, value.toString());
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      // FIXED: Append files with correct field names (with "Path" suffix)
      if (data.passportPath && data.passportPath[0]) {
        formData.append("passportPath", data.passportPath[0]);
      }
      if (data.photoPath && data.photoPath[0]) {
        formData.append("photoPath", data.photoPath[0]);
      }
      if (data.medicalClearancePath && data.medicalClearancePath[0]) {
        formData.append("medicalClearancePath", data.medicalClearancePath[0]);
      }
      if (data.policeClearancePath && data.policeClearancePath[0]) {
        formData.append("policeClearancePath", data.policeClearancePath[0]);
      }

      console.log("Submitting form with data...");
      console.log("Files to upload:", {
        passportPath: data.passportPath?.[0]?.name,
        photoPath: data.photoPath?.[0]?.name,
        medicalClearancePath: data.medicalClearancePath?.[0]?.name,
        policeClearancePath: data.policeClearancePath?.[0]?.name
      });
      
      // Make API request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("http://localhost:5000/api/register/candidate", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorText = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorText = errorData.message || errorText;
        } catch {
          // If response is not JSON, use status text
          errorText = response.statusText || errorText;
        }
        throw new Error(errorText);
      }

      const result = await response.json();
      console.log("Registration response:", result);
      
      if (result.success) {
        setStatus("success");
        setCandidateId(result.candidateId || `REG-${Date.now().toString().slice(-6)}`);
        
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push(`/approval-wait`);
        }, 3000);
      } else {
        throw new Error(result.message || "Registration failed");
      }

    } catch (error: any) {
      console.error("Registration error:", error);
      setStatus("error");
      
      if (error.name === "AbortError") {
        setErrorMessage("Request timeout. Please check your connection and try again.");
      } else {
        setErrorMessage(error.message || "Registration failed. Please try again.");
      }
      
      // Auto-clear error after 10 seconds
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 10000);
    }
  };

  const handleNext = async () => {
    let isValid = false;
    let fieldsToValidate: (keyof CandidateRegistrationFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["firstName", "lastName", "gender", "dateOfBirth", "phone", "email", "nationality", "maritalStatus", "religion"];
        break;
      case 2:
        fieldsToValidate = ["positionApplied", "expectedSalary", "skills", "preferredDestination"];
        break;
      case 3:
        // FIXED: Updated field names for validation
        fieldsToValidate = ["passportPath", "photoPath", "agreeToTerms", "passportNumber", "passportPlaceIssued", "passportDateIssued", "passportExpiryDate"];
        break;
    }

    isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep(currentStep + 1);
      // Scroll to top on step change
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Show validation error
      setStatus("error");
      setErrorMessage(t.validationError);
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 3000);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">{t.personalSection}</h3>
                <p className="text-sm text-muted-foreground">Fill in your personal details</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField label={t.firstName} error={errors.firstName?.message} required>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                          errors.firstName ? "border-destructive bg-destructive/5" : "border-border bg-background"
                        }`}
                        placeholder="John"
                        aria-invalid={!!errors.firstName}
                      />
                    )}
                  />
                </FormField>

                <FormField label={t.lastName} error={errors.lastName?.message} required>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                          errors.lastName ? "border-destructive bg-destructive/5" : "border-border bg-background"
                        }`}
                        placeholder="Doe"
                        aria-invalid={!!errors.lastName}
                      />
                    )}
                  />
                </FormField>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField label={t.gender} error={errors.gender?.message} required>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        value={field.value || ""}
                        onChange={field.onChange}
                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                          errors.gender ? "border-destructive bg-destructive/5" : "border-border bg-background"
                        }`}
                        aria-invalid={!!errors.gender}
                      >
                        <option value="" className="text-muted-foreground">{t.selectGender}</option>
                        <option value="Male">{t.male}</option>
                        <option value="Female">{t.female}</option>
                        <option value="Other">{t.other}</option>
                      </select>
                    )}
                  />
                </FormField>

                <FormField label={t.dateOfBirth} error={errors.dateOfBirth?.message} required>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                          errors.dateOfBirth ? "border-destructive bg-destructive/5" : "border-border bg-background"
                        }`}
                        aria-invalid={!!errors.dateOfBirth}
                      />
                    )}
                  />
                </FormField>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <FormField label={t.age}>
                  <Controller
                    name="age"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="18"
                        max="65"
                        value={field.value || ""}
                        readOnly
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 text-sm"
                        placeholder="Auto-calculated"
                      />
                    )}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Auto-calculated from date of birth</p>
                </FormField>

                <FormField label={t.weight}>
                  <Controller
                    name="weight"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="40"
                        max="150"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseInt(value));
                        }}
                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                          errors.weight ? "border-destructive bg-destructive/5" : "border-border bg-background"
                        }`}
                        placeholder="65"
                        aria-invalid={!!errors.weight}
                      />
                    )}
                  />
                </FormField>

                <FormField label={t.height}>
                  <Controller
                    name="height"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="140"
                        max="220"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseInt(value));
                        }}
                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                          errors.height ? "border-destructive bg-destructive/5" : "border-border bg-background"
                        }`}
                        placeholder="170"
                        aria-invalid={!!errors.height}
                      />
                    )}
                  />
                </FormField>
              </div>

              <FormField label={t.placeOfBirth} error={errors.placeOfBirth?.message} required>
                <Controller
                  name="placeOfBirth"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                        errors.placeOfBirth ? "border-destructive bg-destructive/5" : "border-border bg-background"
                      }`}
                      placeholder="City, Country"
                      aria-invalid={!!errors.placeOfBirth}
                    />
                  )}
                />
              </FormField>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField label={t.nationality} error={errors.nationality?.message} required>
                  <Controller
                    name="nationality"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                          errors.nationality ? "border-destructive bg-destructive/5" : "border-border bg-background"
                        }`}
                        placeholder="Ethiopian"
                        aria-invalid={!!errors.nationality}
                      />
                    )}
                  />
                </FormField>

                <FormField label={t.religion} error={errors.religion?.message} required>
                  <Controller
                    name="religion"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                          errors.religion ? "border-destructive bg-destructive/5" : "border-border bg-background"
                        }`}
                        placeholder="Muslim"
                        aria-invalid={!!errors.religion}
                      />
                    )}
                  />
                </FormField>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField label={t.maritalStatus} error={errors.maritalStatus?.message} required>
                  <Controller
                    name="maritalStatus"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        value={field.value || ""}
                        onChange={field.onChange}
                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                          errors.maritalStatus ? "border-destructive bg-destructive/5" : "border-border bg-background"
                        }`}
                        aria-invalid={!!errors.maritalStatus}
                      >
                        <option value="" className="text-muted-foreground">{t.selectMaritalStatus}</option>
                        <option value="Single">{t.single}</option>
                        <option value="Married">{t.married}</option>
                        <option value="Divorced">{t.divorced}</option>
                        <option value="Widowed">{t.widowed}</option>
                      </select>
                    )}
                  />
                </FormField>

                <FormField label={t.numberOfChildren}>
                  <Controller
                    name="numberOfChildren"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="0"
                        max="10"
                        value={field.value || 0}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? 0 : parseInt(value));
                        }}
                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                          errors.numberOfChildren ? "border-destructive bg-destructive/5" : "border-border bg-background"
                        }`}
                        placeholder="0"
                        aria-invalid={!!errors.numberOfChildren}
                      />
                    )}
                  />
                </FormField>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField label={t.phone} error={errors.phone?.message} required>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          +251
                        </div>
                        <input
                          {...field}
                          type="tel"
                          className={`w-full pl-16 pr-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                            errors.phone ? "border-destructive bg-destructive/5" : "border-border bg-background"
                          }`}
                          placeholder="912345678"
                          aria-invalid={!!errors.phone}
                        />
                      </div>
                    )}
                  />
                </FormField>

                <FormField label={t.email} error={errors.email?.message} required>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                          errors.email ? "border-destructive bg-destructive/5" : "border-border bg-background"
                        }`}
                        placeholder={t.emailPlaceholder}
                        aria-invalid={!!errors.email}
                      />
                    )}
                  />
                </FormField>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">{t.employmentSection}</h3>
                <p className="text-sm text-muted-foreground">Tell us about your skills and job preferences</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField label={t.positionApplied} error={errors.positionApplied?.message} required>
                  <Controller
                    name="positionApplied"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                          errors.positionApplied ? "border-destructive bg-destructive/5" : "border-border bg-background"
                        }`}
                        placeholder="e.g., House Maid, Driver, Nurse"
                        aria-invalid={!!errors.positionApplied}
                      />
                    )}
                  />
                </FormField>

                <FormField label={t.expectedSalary} error={errors.expectedSalary?.message} required>
                  <Controller
                    name="expectedSalary"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          $
                        </div>
                        <input
                          {...field}
                          type="number"
                          min="300"
                          max="5000"
                          step="100"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? "" : parseInt(value));
                          }}
                          className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                            errors.expectedSalary ? "border-destructive bg-destructive/5" : "border-border bg-background"
                          }`}
                          placeholder="1000"
                          aria-invalid={!!errors.expectedSalary}
                        />
                      </div>
                    )}
                  />
                </FormField>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-5 h-5 text-primary" />
                  <h4 className="text-lg font-semibold text-foreground">{t.skillsChecklist}</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[
                    { name: "cleaning", label: t.cleaning, icon: "🧹" },
                    { name: "washing", label: t.washing, icon: "👚" },
                    { name: "ironing", label: t.ironing, icon: "♨️" },
                    { name: "sewing", label: t.sewing, icon: "🪡" },
                    { name: "babySitting", label: t.babySitting, icon: "👶" },
                    { name: "cooking", label: t.cooking, icon: "🍳" },
                    { name: "arabicCooking", label: t.arabicCooking, icon: "🌮" },
                    { name: "elderlyCare", label: t.elderlyCare, icon: "👵" },
                    { name: "caregiver", label: t.caregiver, icon: "🏥" },
                  ].map((skill) => (
                    <Controller
                      key={skill.name}
                      name={skill.name as keyof CandidateRegistrationFormData}
                      control={control}
                      render={({ field }) => (
                        <label className={`
                          flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all
                          ${field.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-primary/5'}
                        `}>
                          <span className="text-2xl">{skill.icon}</span>
                          <span className="text-sm font-medium text-center">{skill.label}</span>
                          <input
                            type="checkbox"
                            checked={field.value as boolean}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${field.value ? 'bg-primary border-primary' : 'bg-background border-border'}`}>
                            {field.value && (
                              <CheckCircle className="w-4 h-4 text-primary-foreground" />
                            )}
                          </div>
                        </label>
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField label={t.otherSkills}>
                  <Controller
                    name="otherSkills"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        placeholder={t.otherSkillsPlaceholder}
                      />
                    )}
                  />
                </FormField>

                <FormField label={t.otherLanguages}>
                  <Controller
                    name="otherLanguages"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        placeholder={t.otherLanguagesPlaceholder}
                      />
                    )}
                  />
                </FormField>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">{t.languageProficiency}</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField label={t.arabicProficiency}>
                    <Controller
                      name="arabicProficiency"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Beginner</span>
                            <span className="text-sm text-muted-foreground">Expert</span>
                          </div>
                          <input
                            {...field}
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={field.value || 1}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? 1 : parseInt(value));
                            }}
                            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                          />
                          <div className="flex justify-center">
                            <span className="text-lg font-bold text-primary">{field.value || 1}/10</span>
                          </div>
                        </div>
                      )}
                    />
                  </FormField>

                  <FormField label={t.englishProficiency}>
                    <Controller
                      name="englishProficiency"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Beginner</span>
                            <span className="text-sm text-muted-foreground">Expert</span>
                          </div>
                          <input
                            {...field}
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={field.value || 1}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? 1 : parseInt(value));
                            }}
                            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                          />
                          <div className="flex justify-center">
                            <span className="text-lg font-bold text-primary">{field.value || 1}/10</span>
                          </div>
                        </div>
                      )}
                    />
                  </FormField>
                </div>
              </div>

              <FormField label={t.skills} error={errors.skills?.message} required>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none ${
                        errors.skills ? "border-destructive bg-destructive/5" : "border-border bg-background"
                      }`}
                      placeholder={t.skillsPlaceholder}
                      aria-invalid={!!errors.skills}
                    />
                  )}
                />
              </FormField>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-primary" />
                  <h4 className="text-lg font-semibold text-foreground">{t.previousEmployment}</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField label={t.previousEmploymentCountry}>
                    <Controller
                      name="previousEmploymentCountry"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                          placeholder="e.g., Saudi Arabia"
                        />
                      )}
                    />
                  </FormField>

                  <FormField label={t.previousEmploymentPeriod}>
                    <Controller
                      name="previousEmploymentPeriod"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                          placeholder="e.g., 2020-2022"
                        />
                      )}
                    />
                  </FormField>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h4 className="text-lg font-semibold text-foreground">{t.preferredDestination}</h4>
                </div>
                {/* FIXED: Added label prop */}
                <FormField label={t.preferredDestination} error={errors.preferredDestination?.message} required>
                  <Controller
                    name="preferredDestination"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-4">
                        <select
                          {...field}
                          value={field.value || ""}
                          onChange={field.onChange}
                          className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                            errors.preferredDestination ? "border-destructive bg-destructive/5" : "border-border bg-background"
                          }`}
                          aria-invalid={!!errors.preferredDestination}
                        >
                          <option value="" className="text-muted-foreground">{t.selectDestination}</option>
                          <option value="Dubai">🇦🇪 {t.dubai}</option>
                          <option value="Qatar">🇶🇦 {t.qatar}</option>
                          <option value="Saudi Arabia">🇸🇦 {t.saudiArabia}</option>
                          <option value="Other">{t.others}</option>
                        </select>
                        {preferredDestination === "Other" && (
                          <Controller
                            name="otherDestination"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                placeholder={t.otherDestinationPlaceholder}
                              />
                            )}
                          />
                        )}
                      </div>
                    )}
                  />
                </FormField>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">{t.documentsSection}</h3>
                <p className="text-sm text-muted-foreground">Upload required documents and agree to terms</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-6">Passport Information</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField label={t.passportNumber} error={errors.passportNumber?.message} required>
                    <Controller
                      name="passportNumber"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                            errors.passportNumber ? "border-destructive bg-destructive/5" : "border-border bg-background"
                          }`}
                          placeholder="EQ2317002"
                          aria-invalid={!!errors.passportNumber}
                        />
                      )}
                    />
                  </FormField>

                  <FormField label={t.passportPlaceIssued} error={errors.passportPlaceIssued?.message} required>
                    <Controller
                      name="passportPlaceIssued"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                            errors.passportPlaceIssued ? "border-destructive bg-destructive/5" : "border-border bg-background"
                          }`}
                          placeholder="Addis Ababa"
                          aria-invalid={!!errors.passportPlaceIssued}
                        />
                      )}
                    />
                  </FormField>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <FormField label={t.passportDateIssued} error={errors.passportDateIssued?.message} required>
                    <Controller
                      name="passportDateIssued"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                            errors.passportDateIssued ? "border-destructive bg-destructive/5" : "border-border bg-background"
                          }`}
                          aria-invalid={!!errors.passportDateIssued}
                        />
                      )}
                    />
                  </FormField>

                  <FormField label={t.passportExpiryDate} error={errors.passportExpiryDate?.message} required>
                    <Controller
                      name="passportExpiryDate"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                            errors.passportExpiryDate ? "border-destructive bg-destructive/5" : "border-border bg-background"
                          }`}
                          aria-invalid={!!errors.passportExpiryDate}
                        />
                      )}
                    />
                  </FormField>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Upload className="w-5 h-5 text-primary" />
                  <h4 className="text-lg font-semibold text-foreground">{t.documents}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{t.documentsDesc}</p>

                <div className="space-y-6">
                  {/* Passport Upload - FIXED: Updated field name */}
                  <FormField label={t.passport} error={errors.passportPath?.message} required>
                    <Controller
                      name="passportPath"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <div
                          className={`
                            border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer
                            ${dragActive === 'passport' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'}
                            ${errors.passportPath ? 'border-destructive bg-destructive/5' : ''}
                          `}
                          onClick={() => handleFileClick(passportRef)}
                          onDragEnter={(e) => handleDrag(e, 'passport')}
                          onDragLeave={(e) => handleDrag(e, 'passport')}
                          onDragOver={(e) => handleDrag(e, 'passport')}
                          onDrop={(e) => handleDrop(e, 'passportPath')}
                        >
                          <input
                            ref={passportRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => onChange(Array.from(e.target.files || []))}
                            className="hidden"
                            id="passportPath"
                          />
                          <div className="flex flex-col items-center justify-center gap-3">
                            <Upload className={`w-10 h-10 ${errors.passportPath ? 'text-destructive' : 'text-primary'}`} />
                            <div className="text-center">
                              <p className="font-medium">{t.passport}</p>
                              <p className="text-sm text-muted-foreground mt-1">{t.uploadFile}</p>
                              <p className="text-xs text-muted-foreground mt-1">{t.maxSize}</p>
                            </div>
                            {value?.[0] ? (
                              <div className="mt-3 px-4 py-2 bg-accent/10 rounded-lg">
                                <p className="text-sm font-medium text-accent">✓ {value[0].name}</p>
                              </div>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFileClick(passportRef);
                                }}
                              >
                                {t.browse}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    />
                  </FormField>

                  {/* Photo Upload - FIXED: Updated field name */}
                  <FormField label={t.photo} error={errors.photoPath?.message} required>
                    <Controller
                      name="photoPath"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <div
                          className={`
                            border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer
                            ${dragActive === 'photo' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'}
                            ${errors.photoPath ? 'border-destructive bg-destructive/5' : ''}
                          `}
                          onClick={() => handleFileClick(photoRef)}
                          onDragEnter={(e) => handleDrag(e, 'photo')}
                          onDragLeave={(e) => handleDrag(e, 'photo')}
                          onDragOver={(e) => handleDrag(e, 'photo')}
                          onDrop={(e) => handleDrop(e, 'photoPath')}
                        >
                          <input
                            ref={photoRef}
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => onChange(Array.from(e.target.files || []))}
                            className="hidden"
                            id="photoPath"
                          />
                          <div className="flex flex-col items-center justify-center gap-3">
                            <Upload className={`w-10 h-10 ${errors.photoPath ? 'text-destructive' : 'text-primary'}`} />
                            <div className="text-center">
                              <p className="font-medium">{t.photo}</p>
                              <p className="text-sm text-muted-foreground mt-1">{t.uploadFile}</p>
                              <p className="text-xs text-muted-foreground mt-1">{t.maxSize}</p>
                            </div>
                            {value?.[0] ? (
                              <div className="mt-3 px-4 py-2 bg-accent/10 rounded-lg">
                                <p className="text-sm font-medium text-accent">✓ {value[0].name}</p>
                              </div>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFileClick(photoRef);
                                }}
                              >
                                {t.browse}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    />
                  </FormField>

                  {/* Medical Clearance (Optional) - FIXED: Updated field name */}
                  <FormField label={`${t.medicalClearance} (Optional)`}>
                    <Controller
                      name="medicalClearancePath"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <div
                          className={`
                            border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer
                            ${dragActive === 'medical' ? 'border-border bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'}
                          `}
                          onClick={() => handleFileClick(medicalRef)}
                          onDragEnter={(e) => handleDrag(e, 'medical')}
                          onDragLeave={(e) => handleDrag(e, 'medical')}
                          onDragOver={(e) => handleDrag(e, 'medical')}
                          onDrop={(e) => handleDrop(e, 'medicalClearancePath')}
                        >
                          <input
                            ref={medicalRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => onChange(Array.from(e.target.files || []))}
                            className="hidden"
                            id="medicalClearancePath"
                          />
                          <div className="flex flex-col items-center justify-center gap-3">
                            <Upload className="w-10 h-10 text-muted-foreground" />
                            <div className="text-center">
                              <p className="font-medium">{t.medicalClearance}</p>
                              <p className="text-sm text-muted-foreground mt-1">{t.uploadFile}</p>
                              <p className="text-xs text-muted-foreground mt-1">{t.maxSize}</p>
                            </div>
                            {value?.[0] ? (
                              <div className="mt-3 px-4 py-2 bg-accent/10 rounded-lg">
                                <p className="text-sm font-medium text-accent">✓ {value[0].name}</p>
                              </div>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFileClick(medicalRef);
                                }}
                              >
                                {t.browse}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    />
                  </FormField>

                  {/* Police Clearance (Optional) - FIXED: Updated field name */}
                  <FormField label={`${t.policeClearance} (Optional)`}>
                    <Controller
                      name="policeClearancePath"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <div
                          className={`
                            border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer
                            ${dragActive === 'police' ? 'border-border bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'}
                          `}
                          onClick={() => handleFileClick(policeRef)}
                          onDragEnter={(e) => handleDrag(e, 'police')}
                          onDragLeave={(e) => handleDrag(e, 'police')}
                          onDragOver={(e) => handleDrag(e, 'police')}
                          onDrop={(e) => handleDrop(e, 'policeClearancePath')}
                        >
                          <input
                            ref={policeRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => onChange(Array.from(e.target.files || []))}
                            className="hidden"
                            id="policeClearancePath"
                          />
                          <div className="flex flex-col items-center justify-center gap-3">
                            <Upload className="w-10 h-10 text-muted-foreground" />
                            <div className="text-center">
                              <p className="font-medium">{t.policeClearance}</p>
                              <p className="text-sm text-muted-foreground mt-1">{t.uploadFile}</p>
                              <p className="text-xs text-muted-foreground mt-1">{t.maxSize}</p>
                            </div>
                            {value?.[0] ? (
                              <div className="mt-3 px-4 py-2 bg-accent/10 rounded-lg">
                                <p className="text-sm font-medium text-accent">✓ {value[0].name}</p>
                              </div>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFileClick(policeRef);
                                }}
                              >
                                {t.browse}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    />
                  </FormField>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <Controller
                    name="agreeToTerms"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <div className="relative">
                        <input
                          {...field}
                          type="checkbox"
                          checked={value}
                          onChange={(e) => onChange(e.target.checked)}
                          className="sr-only"
                          aria-invalid={!!errors.agreeToTerms}
                        />
                        <div className={`
                          w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                          ${value ? 'bg-primary border-primary' : 'bg-background border-border group-hover:border-primary'}
                          ${errors.agreeToTerms ? 'border-destructive' : ''}
                        `}>
                          {value && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                        </div>
                      </div>
                    )}
                  />
                  <div className="flex-1">
                    <p className="text-foreground font-medium">
                      {t.agreeToTerms}{" "}
                      <Link href="/terms" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                        (view terms and conditions)
                      </Link>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      By checking this box, you agree to our terms of service and privacy policy.
                    </p>
                    {errors.agreeToTerms && (
                      <p className="text-destructive text-sm mt-2">{errors.agreeToTerms.message}</p>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/5 pt-30">
      <Header language={language} onLanguageChange={setLanguage} onSignupClick={() => {}} />

      <div className="flex-grow py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-border text-muted-foreground'}`}>
                  1
                </div>
                <span className={`font-medium ${currentStep >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {t.step1}
                </span>
              </div>
              <div className="h-1 flex-1 mx-4 bg-border"></div>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-border text-muted-foreground'}`}>
                  2
                </div>
                <span className={`font-medium ${currentStep >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {t.step2}
                </span>
              </div>
              <div className="h-1 flex-1 mx-4 bg-border"></div>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-border text-muted-foreground'}`}>
                  3
                </div>
                <span className={`font-medium ${currentStep >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {t.step3}
                </span>
              </div>
            </div>
            <ProgressBar currentStep={currentStep} totalSteps={3} />
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="mb-8 p-6 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/30 rounded-2xl flex gap-4 items-start animate-in slide-in-from-top duration-300">
              <div className="p-2 bg-accent/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-accent mb-1">{t.success}</h3>
                <p className="text-accent/80 text-sm">
                  {t.successMsg.replace("{id}", candidateId)}
                </p>
                <div className="w-full h-2 bg-accent/20 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-accent rounded-full animate-[progress_3s_linear]"></div>
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mb-8 p-6 bg-gradient-to-r from-destructive/10 to-destructive/5 border border-destructive/30 rounded-2xl flex gap-4 items-start animate-in slide-in-from-top duration-300">
              <div className="p-2 bg-destructive/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-destructive mb-1">{t.error}</h3>
                <p className="text-destructive/80 text-sm">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <Card className="p-8 md:p-10 border-border/50 shadow-xl backdrop-blur-sm bg-background/95">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || status === "loading"}
                  className="flex-1 sm:flex-none gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t.previous}
                </Button>

                <div className="flex-1"></div>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={status === "loading"}
                    className="flex-1 sm:flex-none gap-2"
                  >
                    {t.next}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={status === "loading" || !agreeToTerms}
                    className="flex-1 sm:flex-none gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t.loading}
                      </>
                    ) : (
                      t.submit
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Back to Selection */}
          <div className="text-center mt-10">
            <Link 
              href="/signup-selection" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t.backToSelection}
            </Link>
          </div>
        </div>
      </div>

      <Footer language={language} />
    </main>
  );
}