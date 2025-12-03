"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FormField } from "@/components/form-field";
import { ProgressBar } from "@/components/progress-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Upload, Building2, Users, MapPin, Award } from "lucide-react";
import Link from "next/link";
import * as z from "zod";

const agencyRegistrationSchema = z.object({
	agencyName: z.string().min(3, "Agency name is required"),
	licenseNumber: z.string().min(3, "License number is required"),
	licenseExpiryDate: z.string().min(1, "License expiry date is required"),
	authorizedCountries: z.string().min(3, "Authorized countries are required"),
	yearEstablished: z.string().regex(/^\d{4}$/, "Enter a valid year"),
	directorFirstName: z.string().min(2, "Director first name is required"),
	directorLastName: z.string().min(2, "Director last name is required"),
	directorPhone: z.string().regex(/^\+?\d{7,15}$/, "Invalid phone number format"),
	directorEmail: z.string().email("Invalid email address"),
	contactPhone: z.string().regex(/^\+?\d{7,15}$/, "Invalid phone number format"),
	contactEmail: z.string().email("Invalid email address"),
	address: z.string().min(5, "Address is required"),
	city: z.string().min(2, "City is required"),
	region: z.string().min(2, "Region is required"),
	numberOfRecruiters: z.string().min(1, "Number of recruiters is required"),
	numberOfActivePlacements: z.string().optional(),
	servicesOffered: z.string().min(10, "Please describe services offered"),
	previousExperience: z.enum(["Yes", "No"], {
		required_error: "Please specify previous experience",
	}),
	experienceYears: z.string().optional(),
	licenseDocument: z.instanceof(FileList)
		.refine((files) => files.length > 0, "License document is required")
		.refine((files) => files[0].size <= 5 * 1024 * 1024, "File size must be less than 5MB")
		.refine(
			(files) => ['application/pdf', 'image/jpeg', 'image/jpg'].includes(files[0]?.type),
			"Only PDF and JPEG files are allowed"
		),
	registrationCertificate: z.instanceof(FileList).optional(),
	directorPhoto: z.instanceof(FileList).optional(),
	agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to terms"),
});

type AgencyRegistrationFormData = z.infer<typeof agencyRegistrationSchema>;

const translations = {
	en: {
		title: "Agency Registration",
		subtitle: "Register as a licensed recruitment agency to manage overseas employment",
		agencySection: "Agency Information",
		directorSection: "Director Details",
		operationsSection: "Operations Information",
		documentsSection: "Required Documents",
		agencyName: "Agency Name",
		licenseNumber: "License Number",
		licenseExpiryDate: "License Expiry Date",
		authorizedCountries: "Authorized Countries",
		authorizedCountriesPlaceholder: "e.g., Dubai, Qatar, Saudi Arabia, Kuwait",
		yearEstablished: "Year Established",
		directorFirstName: "Director First Name",
		directorLastName: "Director Last Name",
		directorPhone: "Director Phone",
		directorEmail: "Director Email",
		contactPhone: "Contact Phone",
		contactEmail: "Contact Email",
		address: "Address",
		city: "City",
		region: "Region",
		selectRegion: "Select region",
		numberOfRecruiters: "Number of Recruiters",
		numberOfActivePlacements: "Number of Active Placements (Optional)",
		servicesOffered: "Services Offered",
		servicesPlaceholder: "Describe the recruitment services you provide",
		previousExperience: "Previous Experience",
		selectExperience: "Do you have previous experience in recruitment?",
		yes: "Yes",
		no: "No",
		experienceYears: "Years of Experience",
		documents: "Upload Documents",
		documentsDesc: "Upload required documents for verification (PDF/JPEG, max 5MB each)",
		licenseDocument: "Agency License",
		registrationCertificate: "Registration Certificate",
		directorPhoto: "Director Photo",
		agreeToTerms: "I agree to the terms and conditions",
		previous: "Previous",
		next: "Next",
		submit: "Submit Registration",
		backToSelection: "Back to Selection",
		success: "Registration Successful!",
		successMsg: "Your agency ID is: {id}. Verification will be completed within 5-7 business days.",
		error: "Registration failed. Please try again.",
		loading: "Submitting...",
	},
	am: {
		title: "አጀንዲ ምዝገባ",
		subtitle: "የቅጥር አጀንዲ ተመዝግበው የውጭ ስራ አድራሻን ያቀናብሩ",
		agencySection: "የአጀንዲ መረጃ",
		directorSection: "የዳይሬክተር ዝርዝሮች",
		operationsSection: "የአውደጥ ሰራተኛዎች",
		documentsSection: "የሚያስፈልጉ ሰነዶች",
		agencyName: "የአጀንዲ ስም",
		licenseNumber: "የፈቃድ ቁጥር",
		licenseExpiryDate: "የፈቃድ የሚያበቃቀት ቀን",
		authorizedCountries: "ተፈቅደው የነው ሀገሮች",
		authorizedCountriesPlaceholder: "ምሳሌ፡ ዱባይ፣ ቃታር፣ ሳውዲ አረቢያ፣ ኩዌይት",
		yearEstablished: "የተመሰረተበት አመት",
		directorFirstName: "የዳይሬክተር ስም",
		directorLastName: "የዳይሬክተር የቤተሰብ ስም",
		directorPhone: "ዳይሬክተር ስልክ",
		directorEmail: "ዳይሬክተር ኢሜይል",
		contactPhone: "የአድራሻ ስልክ",
		contactEmail: "የአድራሻ ኢሜይል",
		address: "አድራሻ",
		city: "ከተማ",
		region: "ክልል",
		selectRegion: "ክልል ይምረጡ",
		numberOfRecruiters: "የቅጥር ባለሙያዎች ቁጥር",
		numberOfActivePlacements: "የንቁ የምቾት ቁጥር (አማራጭ)",
		servicesOffered: "የሚሰጡ አገልግሎቶች",
		servicesPlaceholder: "የሚሰጡትን የቅጥር አገልግሎቶች ይግለጹ",
		previousExperience: "የቀደም ልምድ",
		selectExperience: "በቅጥር ውስጥ ቀደም ልምድ አሎት?",
		yes: "አዎ",
		no: "አይ",
		experienceYears: "የልምድ አመታት",
		documents: "ሰነዶች ይጫኑ",
		documentsDesc: "ለማረጋገጥ የሚያስፈልጉትን ሰነዶች ይጫኑ (PDF/JPEG, ከ5MB በታች)",
		licenseDocument: "የአጀንዲ ፈቃድ",
		registrationCertificate: "የምዝገባ የምስክር ወረቀት",
		directorPhoto: "ዳይሬክተር ፎቶ",
		agreeToTerms: "ከውል እና ሁኔታዎች ጋር ይስማማ",
		previous: "ቀዳሚ",
		next: "ቀጣይ",
		submit: "ምዝገባ ያስገቡ",
		backToSelection: "ወደ ምርጫ ተመለስ",
		success: "ምዝገባ ተሳክቷል!",
		successMsg: "የእርስዎ አጀንዲ ID: {id}። ማረጋገጥ በ5-7 የስራ ቀናት ውስጥ ይጀምራል።",
		error: "ምዝገባ ወድቋል። እንደገና ይሞክሩ።",
		loading: "ይላካል...",
	},
};

const REGIONS = [
	"Addis Ababa",
	"Afar",
	"Amhara",
	"Benishangul-Gumuz",
	"Dire Dawa",
	"Gambela",
	"Harari",
	"Oromia",
	"SNNPR",
	"Somali",
	"Tigray",
];

export default function AgencyRegistrationPage() {
	const router = useRouter();
	const [language, setLanguage] = useState("en");
	const [currentStep, setCurrentStep] = useState(1);
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [agencyId, setAgencyId] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const t = translations[language as keyof typeof translations] || translations.en;

	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
		trigger,
	} = useForm<AgencyRegistrationFormData>({
		resolver: zodResolver(agencyRegistrationSchema),
		mode: "onChange",
		defaultValues: {
			agencyName: "",
			licenseNumber: "",
			licenseExpiryDate: "",
			authorizedCountries: "",
			yearEstablished: "",
			directorFirstName: "",
			directorLastName: "",
			directorPhone: "",
			directorEmail: "",
			contactPhone: "",
			contactEmail: "",
			address: "",
			city: "",
			region: "",
			numberOfRecruiters: "",
			numberOfActivePlacements: "",
			servicesOffered: "",
			previousExperience: undefined,
			experienceYears: "",
			agreeToTerms: false,
		},
	});

	const previousExperience = watch("previousExperience");
	const licenseDocument = watch("licenseDocument");
	const registrationCertificate = watch("registrationCertificate");
	const directorPhoto = watch("directorPhoto");
const onSubmit = async (data: AgencyRegistrationFormData) => {
  setStatus("loading");
  setErrorMessage("");

  try {
    const formData = new FormData();

    // Append all required fields
    formData.append("agencyName", data.agencyName);
    formData.append("licenseNumber", data.licenseNumber);
    formData.append("licenseExpiryDate", data.licenseExpiryDate);
    formData.append("authorizedCountries", data.authorizedCountries);
    formData.append("yearEstablished", data.yearEstablished);
    formData.append("directorFirstName", data.directorFirstName);
    formData.append("directorLastName", data.directorLastName);
    formData.append("directorPhone", data.directorPhone);
    formData.append("directorEmail", data.directorEmail);
    formData.append("contactPhone", data.contactPhone);
    formData.append("contactEmail", data.contactEmail);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("region", data.region);
    formData.append("numberOfRecruiters", data.numberOfRecruiters);
    formData.append("servicesOffered", data.servicesOffered);
    formData.append("previousExperience", data.previousExperience);

    // Optional fields
    if (data.numberOfActivePlacements) {
      formData.append("numberOfActivePlacements", data.numberOfActivePlacements);
    }
    if (data.experienceYears) {
      formData.append("experienceYears", data.experienceYears);
    }

    // Boolean field (convert to string)
    formData.append("agreeToTerms", data.agreeToTerms ? "true" : "false");

    // Files
    if (data.licenseDocument?.length) {
      formData.append("licenseDocument", data.licenseDocument[0]);
    }
    if (data.registrationCertificate?.length) {
      formData.append("registrationCertificate", data.registrationCertificate[0]);
    }
    if (data.directorPhoto?.length) {
      formData.append("directorPhoto", data.directorPhoto[0]);
    }

    // Debug: Log form data before sending
    console.log("Submitting form data:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // API request
    const response = await fetch("http://localhost:5000/api/register/agency", {
      method: "POST",
      body: formData, // Browser handles Content-Type automatically
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: "Registration failed. Please check your connection and try again." };
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    setStatus("success");

    setTimeout(() => {
       router.push(`/approval-wait`);
    }, 2000);

  } catch (error) {
    console.error("Registration error:", error);
    setStatus("error");
    setErrorMessage(error instanceof Error ? error.message : "Registration failed. Please try again.");

    setTimeout(() => {
      setStatus("idle");
      setErrorMessage("");
    }, 5000);
  }
};


	const handleNext = async () => {
		let isValid = false;
		
		switch (currentStep) {
			case 1:
				isValid = await trigger(["agencyName", "licenseNumber", "licenseExpiryDate", "authorizedCountries", "yearEstablished", "region", "city", "address"]);
				break;
			case 2:
				isValid = await trigger(["directorFirstName", "directorLastName", "directorPhone", "directorEmail", "contactPhone", "contactEmail"]);
				break;
			case 3:
				isValid = await trigger(["numberOfRecruiters", "servicesOffered", "previousExperience"]);
				break;
			case 4:
				isValid = await trigger(["licenseDocument", "agreeToTerms"]);
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
							<Building2 className="w-5 h-5" />
							{t.agencySection}
						</h3>

						<FormField label={t.agencyName} error={errors.agencyName?.message} required>
							<Controller
								name="agencyName"
								control={control}
								render={({ field }) => (
									<input
										{...field}
										type="text"
										className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
											errors.agencyName ? "border-destructive bg-destructive/5" : "border-border bg-input"
										}`}
										aria-invalid={!!errors.agencyName}
									/>
								)}
							/>
						</FormField>

						<div className="grid md:grid-cols-2 gap-4">
							<FormField label={t.licenseNumber} error={errors.licenseNumber?.message} required>
								<Controller
									name="licenseNumber"
									control={control}
									render={({ field }) => (
										<input
											{...field}
											type="text"
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.licenseNumber ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.licenseNumber}
										/>
									)}
								/>
							</FormField>

							<FormField label={t.licenseExpiryDate} error={errors.licenseExpiryDate?.message} required>
								<Controller
									name="licenseExpiryDate"
									control={control}
									render={({ field }) => (
										<input
											{...field}
											type="date"
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.licenseExpiryDate ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.licenseExpiryDate}
										/>
									)}
								/>
							</FormField>
						</div>

						<FormField label={t.authorizedCountries} error={errors.authorizedCountries?.message} required>
							<Controller
								name="authorizedCountries"
								control={control}
								render={({ field }) => (
									<textarea
										{...field}
										rows={2}
										placeholder={t.authorizedCountriesPlaceholder}
										className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
											errors.authorizedCountries ? "border-destructive bg-destructive/5" : "border-border bg-input"
										}`}
										aria-invalid={!!errors.authorizedCountries}
									/>
								)}
							/>
						</FormField>

						<div className="grid md:grid-cols-2 gap-4">
							<FormField label={t.yearEstablished} error={errors.yearEstablished?.message} required>
								<Controller
									name="yearEstablished"
									control={control}
									render={({ field }) => (
										<input
											{...field}
											type="text"
											placeholder="YYYY"
											maxLength={4}
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.yearEstablished ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.yearEstablished}
										/>
									)}
								/>
							</FormField>

							<FormField label={t.region} error={errors.region?.message} required>
								<Controller
									name="region"
									control={control}
									render={({ field }) => (
										<select
											{...field}
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.region ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.region}
										>
											<option value="">{t.selectRegion}</option>
											{REGIONS.map((r) => (
												<option key={r} value={r}>
													{r}
												</option>
											))}
										</select>
									)}
								/>
							</FormField>
						</div>

						<div className="grid md:grid-cols-2 gap-4">
							<FormField label={t.city} error={errors.city?.message} required>
								<Controller
									name="city"
									control={control}
									render={({ field }) => (
										<input
											{...field}
											type="text"
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.city ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.city}
										/>
									)}
								/>
							</FormField>

							<FormField label={t.address} error={errors.address?.message} required>
								<Controller
									name="address"
									control={control}
									render={({ field }) => (
										<input
											{...field}
											type="text"
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.address ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.address}
										/>
									)}
								/>
							</FormField>
						</div>
					</div>
				);

			case 2:
				return (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
							<Users className="w-5 h-5" />
							{t.directorSection}
						</h3>

						<div className="grid md:grid-cols-2 gap-4">
							<FormField label={t.directorFirstName} error={errors.directorFirstName?.message} required>
								<Controller
									name="directorFirstName"
									control={control}
									render={({ field }) => (
										<input
											{...field}
											type="text"
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.directorFirstName ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.directorFirstName}
										/>
									)}
								/>
							</FormField>

							<FormField label={t.directorLastName} error={errors.directorLastName?.message} required>
								<Controller
									name="directorLastName"
									control={control}
									render={({ field }) => (
										<input
											{...field}
											type="text"
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.directorLastName ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.directorLastName}
										/>
									)}
								/>
							</FormField>
						</div>

						<div className="grid md:grid-cols-2 gap-4">
							<FormField label={t.directorPhone} error={errors.directorPhone?.message} required>
								<Controller
									name="directorPhone"
									control={control}
									render={({ field }) => (
										<input
											{...field}
											type="tel"
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.directorPhone ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.directorPhone}
										/>
									)}
								/>
							</FormField>

							<FormField label={t.directorEmail} error={errors.directorEmail?.message} required>
								<Controller
									name="directorEmail"
									control={control}
									render={({ field }) => (
										<input
											{...field}
											type="email"
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.directorEmail ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.directorEmail}
										/>
									)}
								/>
							</FormField>
						</div>

						<div className="grid md:grid-cols-2 gap-4">
							<FormField label={t.contactPhone} error={errors.contactPhone?.message} required>
								<Controller
									name="contactPhone"
									control={control}
									render={({ field }) => (
										<input
											{...field}
											type="tel"
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.contactPhone ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.contactPhone}
										/>
									)}
								/>
							</FormField>

							<FormField label={t.contactEmail} error={errors.contactEmail?.message} required>
								<Controller
									name="contactEmail"
									control={control}
									render={({ field }) => (
										<input
											{...field}
											type="email"
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.contactEmail ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.contactEmail}
										/>
									)}
								/>
							</FormField>
						</div>
					</div>
				);

			case 3:
				return (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
							<Award className="w-5 h-5" />
							{t.operationsSection}
						</h3>

						<div className="grid md:grid-cols-2 gap-4">
							<FormField label={t.numberOfRecruiters} error={errors.numberOfRecruiters?.message} required>
								<Controller
									name="numberOfRecruiters"
									control={control}
									render={({ field }) => (
										<select
											{...field}
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.numberOfRecruiters ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.numberOfRecruiters}
										>
											<option value="">Select</option>
											<option value="1-5">1-5 recruiters</option>
											<option value="6-10">6-10 recruiters</option>
											<option value="11-20">11-20 recruiters</option>
											<option value="20+">20+ recruiters</option>
										</select>
									)}
								/>
							</FormField>

							<FormField label={t.numberOfActivePlacements}>
								<Controller
									name="numberOfActivePlacements"
									control={control}
									render={({ field }) => (
										<input
											{...field}
											type="text"
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.numberOfActivePlacements ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.numberOfActivePlacements}
										/>
									)}
								/>
							</FormField>
						</div>

						<FormField label={t.servicesOffered} error={errors.servicesOffered?.message} required>
							<Controller
								name="servicesOffered"
								control={control}
								render={({ field }) => (
									<textarea
										{...field}
										rows={4}
										placeholder={t.servicesPlaceholder}
										className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
											errors.servicesOffered ? "border-destructive bg-destructive/5" : "border-border bg-input"
										}`}
										aria-invalid={!!errors.servicesOffered}
									/>
								)}
							/>
						</FormField>

						<FormField label={t.previousExperience} error={errors.previousExperience?.message} required>
							<Controller
								name="previousExperience"
								control={control}
								render={({ field }) => (
									<select
										{...field}
										className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
											errors.previousExperience ? "border-destructive bg-destructive/5" : "border-border bg-input"
										}`}
										aria-invalid={!!errors.previousExperience}
									>
										<option value="">{t.selectExperience}</option>
										<option value="Yes">{t.yes}</option>
										<option value="No">{t.no}</option>
									</select>
								)}
							/>
						</FormField>

						{previousExperience === "Yes" && (
							<FormField label={t.experienceYears} error={errors.experienceYears?.message}>
								<Controller
									name="experienceYears"
									control={control}
									render={({ field }) => (
										<input
											{...field}
											type="text"
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.experienceYears ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.experienceYears}
										/>
									)}
								/>
							</FormField>
						)}
					</div>
				);

			case 4:
				return (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
							<Upload className="w-5 h-5" />
							{t.documentsSection}
						</h3>
						<p className="text-sm text-muted-foreground">{t.documentsDesc}</p>

						<FormField label={t.licenseDocument} error={errors.licenseDocument?.message} required>
							<Controller
								name="licenseDocument"
								control={control}
								render={({ field: { onChange, value, ...field } }) => (
									<div>
										<input
											{...field}
											type="file"
											accept=".pdf,.jpg,.jpeg"
											onChange={(e) => onChange(e.target.files)}
											className="hidden"
											id="licenseDocument"
											aria-invalid={!!errors.licenseDocument}
										/>
										<label 
											htmlFor="licenseDocument" 
											className="flex items-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors cursor-pointer"
										>
											<Upload className="w-5 h-5 text-muted-foreground" />
											<span className="text-sm text-foreground">
												{t.licenseDocument} - {value && value.length > 0 ? `✓ ${value[0]?.name}` : "Click to upload"}
											</span>
										</label>
									</div>
								)}
							/>
						</FormField>

						<FormField label={t.registrationCertificate}>
							<Controller
								name="registrationCertificate"
								control={control}
								render={({ field: { onChange, value, ...field } }) => (
									<div>
										<input
											{...field}
											type="file"
											accept=".pdf,.jpg,.jpeg"
											onChange={(e) => onChange(e.target.files)}
											className="hidden"
											id="registrationCertificate"
										/>
										<label 
											htmlFor="registrationCertificate" 
											className="flex items-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors cursor-pointer"
										>
											<Upload className="w-5 h-5 text-muted-foreground" />
											<span className="text-sm text-foreground">
												{t.registrationCertificate} (Optional) - {value && value.length > 0 ? `✓ ${value[0]?.name}` : "Click to upload"}
											</span>
										</label>
									</div>
								)}
							/>
						</FormField>

						<FormField label={t.directorPhoto}>
							<Controller
								name="directorPhoto"
								control={control}
								render={({ field: { onChange, value, ...field } }) => (
									<div>
										<input
											{...field}
											type="file"
											accept=".jpg,.jpeg"
											onChange={(e) => onChange(e.target.files)}
											className="hidden"
											id="directorPhoto"
										/>
										<label 
											htmlFor="directorPhoto" 
											className="flex items-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors cursor-pointer"
										>
											<Upload className="w-5 h-5 text-muted-foreground" />
											<span className="text-sm text-foreground">
												{t.directorPhoto} (Optional) - {value && value.length > 0 ? `✓ ${value[0]?.name}` : "Click to upload"}
											</span>
										</label>
									</div>
								)}
							/>
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
		<main className="w-full min-h-screen flex flex-col pt-30">
			<Header language={language} onLanguageChange={setLanguage} onSignupClick={() => {}} />

			<div className="flex-grow py-8 md:py-12">
				<div className="max-w-2xl mx-auto px-4">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{t.title}</h1>
						<p className="text-muted-foreground">{t.subtitle}</p>
					</div>

					{/* Progress Bar */}
					<div className="mb-8">
						<ProgressBar currentStep={currentStep} totalSteps={4} />
					</div>

					{/* Status Messages */}
					{status === "success" && (
						<div className="mb-6 p-4 bg-accent/10 border border-accent rounded-lg flex gap-3">
							<CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
							<div>
								<p className="text-accent font-medium text-sm">{t.success}</p>
								{agencyId && (
									<p className="text-accent text-sm mt-1">
										{t.successMsg.replace("{id}", agencyId)}
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

								{currentStep < 4 ? (
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