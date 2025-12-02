"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FormField } from "@/components/form-field";
import { ProgressBar } from "@/components/progress-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Upload, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import * as z from "zod";

const candidateRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
  }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phone: z.string().regex(/^\+251\d{9}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address"),
  passportNumber: z.string().min(6, "Passport number is required"),
  skills: z.string().min(10, "Please describe your skills"),
  preferredDestination: z.enum(["Dubai", "Qatar", "Saudi Arabia", "Other"], {
    required_error: "Preferred destination is required",
  }),
  otherDestination: z.string().optional(),
  passport: z.any().refine((files) => files && files.length > 0, "Passport copy is required"),
  photo: z.any().refine((files) => files && files.length > 0, "Photo is required"),
  medicalClearance: z.any().optional(),
  policeClearance: z.any().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to terms"),
});

type CandidateRegistrationFormData = z.infer<typeof candidateRegistrationSchema>;

const translations = {
  en: {
    title: "Candidate Registration",
    subtitle: "Register to search for overseas job opportunities",
    personalSection: "Personal Information",
    documentsSection: "Required Documents",
    preferencesSection: "Job Preferences",
    firstName: "First Name",
    lastName: "Last Name",
    gender: "Gender",
    selectGender: "Select gender",
    male: "Male",
    female: "Female",
    other: "Other",
    dateOfBirth: "Date of Birth",
    phone: "Phone Number",
    phonePlaceholder: "+251912345678",
    email: "Email Address",
    passportNumber: "Passport Number",
    skills: "Skills & Qualifications",
    skillsPlaceholder: "Describe your skills, work experience, and qualifications",
    preferredDestination: "Preferred Destination Country",
    selectDestination: "Select destination country",
    dubai: "Dubai, UAE",
    qatar: "Qatar",
    saudiArabia: "Saudi Arabia",
    unitedStates: "United States",
    canada: "Canada",
    unitedKingdom: "United Kingdom",
    germany: "Germany",
    france: "France",
    india: "India",
    australia: "Australia",
    brazil: "Brazil",
    japan: "Japan",
    italy: "Italy",
    spain: "Spain",
    mexico: "Mexico",
    southKorea: "South Korea",
    china: "China",
    russia: "Russia",
    unitedArabEmirates: "United Arab Emirates",
    egypt: "Egypt",
    nigeria: "Nigeria",
    kenya: "Kenya",
    philippines: "Philippines",
    indonesia: "Indonesia",
    argentina: "Argentina",
    southAfrica: "South Africa",
    others: "Other",
    otherDestinationPlaceholder: "Specify other destination",
    documents: "Upload Documents",
    documentsDesc: "Upload required documents (PDF/JPEG, max 5MB each)",
    passport: "Passport Copy",
    photo: "Passport Size Photo",
    medicalClearance: "Medical Clearance",
    policeClearance: "Police Clearance Certificate",
    agreeToTerms: "I agree to the terms and conditions",
    previous: "Previous",
    next: "Next",
    submit: "Submit Registration",
    backToSelection: "Back to Selection",
    success: "Registration Successful!",
    successMsg: "Your candidate ID is: {id}. Check your email for confirmation.",
    error: "Registration failed. Please try again.",
    loading: "Submitting...",
  },
};

export default function CandidateRegistrationPage() {
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [candidateId, setCandidateId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const t = translations[language as keyof typeof translations] || translations.en;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<CandidateRegistrationFormData>({
    resolver: zodResolver(candidateRegistrationSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      dateOfBirth: "",
      phone: "",
      email: "",
      passportNumber: "",
      skills: "",
      preferredDestination: undefined,
      otherDestination: "",
      passport: [],
      photo: [],
      medicalClearance: [],
      policeClearance: [],
      agreeToTerms: false,
    },
  });

  const preferredDestination = watch("preferredDestination");
  const passport = watch("passport");
  const photo = watch("photo");
  const medicalClearance = watch("medicalClearance");
  const policeClearance = watch("policeClearance");

  const onSubmit = async (data: CandidateRegistrationFormData) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const formData = new FormData();
      
      // Append all form fields
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("gender", data.gender);
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      formData.append("passportNumber", data.passportNumber);
      formData.append("skills", data.skills);
      formData.append("preferredDestination", data.preferredDestination);
      
      if (data.otherDestination) {
        formData.append("otherDestination", data.otherDestination);
      }

      // Append files
      if (data.passport && data.passport[0]) {
        formData.append("passport", data.passport[0]);
      }
      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }
      if (data.medicalClearance && data.medicalClearance[0]) {
        formData.append("medicalClearance", data.medicalClearance[0]);
      }
      if (data.policeClearance && data.policeClearance[0]) {
        formData.append("policeClearance", data.policeClearance[0]);
      }

      // Make API request
      const response = await fetch("http://localhost:5000/api/register/candidate", {
        method: "POST",
        body: formData,
        // Headers are not needed for FormData - browser sets them automatically
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Registration failed" }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setStatus("success");

      // Redirect after success
      setTimeout(() => {
        router.push(`/approval-wait`);
      }, 2000);

    } catch (error) {
      console.error("Registration error:", error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Registration failed. Please try again.");
      
      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 5000);
    }
  };

  const handleNext = async () => {
    // Validate current step before proceeding
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = await trigger(["firstName", "lastName", "gender", "dateOfBirth", "phone", "email", "passportNumber"]);
        break;
      case 2:
        isValid = await trigger(["skills", "preferredDestination"]);
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {t.personalSection}
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField label={t.firstName} error={errors.firstName?.message} required>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.firstName ? "border-destructive bg-destructive/5" : "border-border bg-input"
                      }`}
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
                      className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.lastName ? "border-destructive bg-destructive/5" : "border-border bg-input"
                      }`}
                      aria-invalid={!!errors.lastName}
                    />
                  )}
                />
              </FormField>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField label={t.gender} error={errors.gender?.message} required>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.gender ? "border-destructive bg-destructive/5" : "border-border bg-input"
                      }`}
                      aria-invalid={!!errors.gender}
                    >
                      <option value="">{t.selectGender}</option>
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
                      className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.dateOfBirth ? "border-destructive bg-destructive/5" : "border-border bg-input"
                      }`}
                      aria-invalid={!!errors.dateOfBirth}
                    />
                  )}
                />
              </FormField>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField label={t.phone} error={errors.phone?.message} required>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="tel"
                      placeholder={t.phonePlaceholder}
                      className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.phone ? "border-destructive bg-destructive/5" : "border-border bg-input"
                      }`}
                      aria-invalid={!!errors.phone}
                    />
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
                      className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.email ? "border-destructive bg-destructive/5" : "border-border bg-input"
                      }`}
                      aria-invalid={!!errors.email}
                    />
                  )}
                />
              </FormField>
            </div>

            <FormField label={t.passportNumber} error={errors.passportNumber?.message} required>
              <Controller
                name="passportNumber"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.passportNumber ? "border-destructive bg-destructive/5" : "border-border bg-input"
                    }`}
                    aria-invalid={!!errors.passportNumber}
                  />
                )}
              />
            </FormField>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {t.preferencesSection}
            </h3>

            <FormField label={t.skills} error={errors.skills?.message} required>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={4}
                    placeholder={t.skillsPlaceholder}
                    className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.skills ? "border-destructive bg-destructive/5" : "border-border bg-input"
                    }`}
                    aria-invalid={!!errors.skills}
                  />
                )}
              />
            </FormField>

            <FormField label={t.preferredDestination} error={errors.preferredDestination?.message} required>
              <Controller
                name="preferredDestination"
                control={control}
                render={({ field }) => (
                  <>
                    <select
                      {...field}
                      className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4 ${
                        errors.preferredDestination ? "border-destructive bg-destructive/5" : "border-border bg-input"
                      }`}
                      aria-invalid={!!errors.preferredDestination}
                    >
                      <option value="">{t.selectDestination}</option>
                      <option value="Dubai">🇦🇪 {t.dubai}</option>
                      <option value="Qatar">🇶🇦 {t.qatar}</option>
                      <option value="Saudi Arabia">🇸🇦 {t.saudiArabia}</option>
                      <option value="United States">🇺🇸 {t.unitedStates}</option>
                      <option value="Canada">🇨🇦 {t.canada}</option>
                      <option value="United Kingdom">🇬🇧 {t.unitedKingdom}</option>
                      <option value="Germany">🇩🇪 {t.germany}</option>
                      <option value="France">🇫🇷 {t.france}</option>
                      <option value="India">🇮🇳 {t.india}</option>
                      <option value="Australia">🇦🇺 {t.australia}</option>
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
                            placeholder={t.otherDestinationPlaceholder}
                            className="w-full px-3 py-2 rounded-lg border-2 border-border bg-input text-sm"
                          />
                        )}
                      />
                    )}
                  </>
                )}
              />
            </FormField>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Upload className="w-5 h-5" />
              {t.documentsSection}
            </h3>
            <p className="text-sm text-muted-foreground">{t.documentsDesc}</p>

            {/* Passport */}
            <FormField label={t.passport} error={errors.passport?.message} required>
              <Controller
                name="passport"
                control={control}
                render={({ field: { onChange } }) => (
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => onChange(Array.from(e.target.files || []))}
                    className="hidden"
                    id="passport"
                    aria-invalid={!!errors.passport}
                  />
                )}
              />
              <label htmlFor="passport" className="flex items-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {t.passport} - {passport?.length > 0 ? `✓ ${passport[0]?.name}` : "Click to upload"}
                </span>
              </label>
            </FormField>

            {/* Photo */}
            <FormField label={t.photo} error={errors.photo?.message} required>
              <Controller
                name="photo"
                control={control}
                render={({ field: { onChange } }) => (
                  <input
                    type="file"
                    accept=".jpg,.jpeg"
                    onChange={(e) => onChange(Array.from(e.target.files || []))}
                    className="hidden"
                    id="photo"
                    aria-invalid={!!errors.photo}
                  />
                )}
              />
              <label htmlFor="photo" className="flex items-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {t.photo} - {photo?.length > 0 ? `✓ ${photo[0]?.name}` : "Click to upload"}
                </span>
              </label>
            </FormField>

            {/* Medical Clearance (Optional) */}
            <FormField label={t.medicalClearance}>
              <Controller
                name="medicalClearance"
                control={control}
                render={({ field: { onChange } }) => (
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => onChange(Array.from(e.target.files || []))}
                    className="hidden"
                    id="medicalClearance"
                  />
                )}
              />
              <label htmlFor="medicalClearance" className="flex items-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {t.medicalClearance} (Optional) - {medicalClearance?.length > 0 ? `✓ ${medicalClearance[0]?.name}` : "Click to upload"}
                </span>
              </label>
            </FormField>

            {/* Police Clearance (Optional) */}
            <FormField label={t.policeClearance}>
              <Controller
                name="policeClearance"
                control={control}
                render={({ field: { onChange } }) => (
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => onChange(Array.from(e.target.files || []))}
                    className="hidden"
                    id="policeClearance"
                  />
                )}
              />
              <label htmlFor="policeClearance" className="flex items-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {t.policeClearance} (Optional) - {policeClearance?.length > 0 ? `✓ ${policeClearance[0]?.name}` : "Click to upload"}
                </span>
              </label>
            </FormField>

            <div className="pt-4 border-t border-border">
              <label className="flex items-center gap-2 cursor-pointer">
                <Controller
                  name="agreeToTerms"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <input
                      {...field}
                      type="checkbox"
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      className="w-4 h-4 rounded border-border cursor-pointer"
                      aria-invalid={!!errors.agreeToTerms}
                      value={undefined}
                    />
                  )}
                />
                <span className="text-sm text-foreground">
                  {t.agreeToTerms}{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    (view terms)
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-destructive text-xs mt-1">{errors.agreeToTerms.message}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col">
      <Header language={language} onLanguageChange={setLanguage} onSignupClick={() => {}} />

      <div className="flex-grow py-8 md:py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <ProgressBar currentStep={currentStep} totalSteps={3} />
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="mb-6 p-4 bg-accent/10 border border-accent rounded-lg flex gap-3">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-accent font-medium text-sm">{t.success}</p>
                {candidateId && (
                  <p className="text-accent text-sm mt-1">
                    {t.successMsg.replace("{id}", candidateId)}
                  </p>
                )}
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-destructive font-medium text-sm">{t.error}</p>
                {errorMessage && (
                  <p className="text-destructive text-sm mt-1">{errorMessage}</p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <Card className="p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="flex-1"
                >
                  {t.previous}
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {t.next}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {status === "loading" ? t.loading : t.submit}
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Back to Selection */}
          <div className="text-center mt-6">
            <Link href="/signup-selection" className="text-primary hover:text-primary/80 font-semibold transition-colors">
              ← {t.backToSelection}
            </Link>
          </div>
        </div>
      </div>

      <Footer language={language} />
    </main>
  );
}