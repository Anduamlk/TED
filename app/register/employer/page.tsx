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
import { AlertCircle, CheckCircle, Upload, Building2, UserCheck, Globe } from "lucide-react";
import Link from "next/link";
import * as z from "zod";

const employerRegistrationSchema = z.object({
	companyName: z.string().min(3, "Company name is required"),
	companyType: z.enum(["Private", "Government", "NGO"], {
		required_error: "Company type is required",
	}),
	licenseNumber: z.string().min(3, "License number is required"),
	countryOfOperation: z.string().min(2, "Country of operation is required"),
	city: z.string().min(2, "City is required"),
	address: z.string().min(5, "Address is required"),
	website: z.string().url().optional().or(z.literal("")),
	contactPersonFirstName: z.string().min(2, "Contact person first name is required"),
	contactPersonLastName: z.string().min(2, "Contact person last name is required"),
	contactPersonPosition: z.string().min(2, "Position is required"),
	phone: z.string().regex(/^\+?\d{7,15}$/, "Invalid phone number format"),
	email: z.string().email("Invalid email address"),
	alternateEmail: z.string().email().optional().or(z.literal("")),
	numberOfEmployees: z.string().min(1, "Number of employees is required"),
	sectorsOfOperation: z.string().min(5, "Sectors of operation is required"),
	previousHiringExperience: z.enum(["Yes", "No"], {
		required_error: "Please specify if you have previous hiring experience",
	}),
	hiringHistory: z.string().optional(),
	licenseDocument: z.any().refine((files) => files && files.length > 0, "License document is required"),
	registrationCertificate: z.any().optional(),
	contactPersonPhoto: z.any().optional(),
	agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to terms"),
});

type EmployerRegistrationFormData = z.infer<typeof employerRegistrationSchema>;

const translations = {
	en: {
		title: "Employer Registration",
		subtitle: "Register as an overseas employer and start posting job orders",
		companySection: "Company Information",
		contactSection: "Contact Person Details",
		businessSection: "Business Information",
		documentsSection: "Required Documents",
		companyName: "Company Name",
		companyType: "Company Type",
		selectCompanyType: "Select company type",
		private: "Private",
		government: "Government",
		ngo: "NGO",
		licenseNumber: "Business License Number",
		countryOfOperation: "Country of Operation",
		selectCountry: "Select country",
		city: "City",
		address: "Address",
		website: "Website URL",
		websitePlaceholder: "https://example.com",
		contactPersonFirstName: "Contact Person First Name",
		contactPersonLastName: "Contact Person Last Name",
		contactPersonPosition: "Position/Title",
		phone: "Phone Number",
		email: "Email Address",
		alternateEmail: "Alternate Email (Optional)",
		numberOfEmployees: "Number of Employees",
		sectorsOfOperation: "Sectors of Operation",
		sectorsPlaceholder: "e.g., Construction, Hospitality, Healthcare, etc.",
		previousHiringExperience: "Previous Hiring Experience",
		selectExperience: "Do you have previous experience hiring from Ethiopia?",
		yes: "Yes",
		no: "No",
		hiringHistory: "Brief Hiring History (if yes)",
		hiringHistoryPlaceholder: "Describe your past hiring experience",
		documents: "Upload Documents",
		documentsDesc: "Upload required documents for verification (PDF/JPEG, max 5MB each)",
		licenseDocument: "Business License",
		registrationCertificate: "Registration Certificate",
		contactPersonPhoto: "Contact Person Photo",
		agreeToTerms: "I agree to the terms and conditions",
		previous: "Previous",
		next: "Next",
		submit: "Submit Registration",
		backToSelection: "Back to Selection",
		success: "Registration Successful!",
		successMsg: "Your employer ID is: {id}. Verification will be completed within 3-5 business days.",
		error: "Registration failed. Please try again.",
		loading: "Submitting...",
	},
	am: {
		title: "አሠሪ ምዝገባ",
		subtitle: "እንደ ውጭ አሠሪ ይመዝገቡ እና የስራ ትእዛዞችን ለመለጥፍ ይጀምሩ",
		companySection: "የኩባንያ መረጃ",
		contactSection: "የአድራሻ ሰው ዝርዝሮች",
		businessSection: "የንግድ መረጃ",
		documentsSection: "የሚያስፈልጉ ሰነዶች",
		companyName: "የኩባንያ ስም",
		companyType: "የኩባንያ ዓይነት",
		selectCompanyType: "የኩባንያ ዓይነት ይምረጡ",
		private: "ግላዊ",
		government: "መንግስት",
		ngo: "NGO",
		licenseNumber: "የንግድ ፈቃድ ቁጥር",
		countryOfOperation: "የስራ ሀገር",
		selectCountry: "ሀገር ይምረጡ",
		city: "ከተማ",
		address: "አድራሻ",
		website: "የድር ጣቢያ URL",
		websitePlaceholder: "https://example.com",
		contactPersonFirstName: "የአድራሻ ሰው ስም",
		contactPersonLastName: "የአድራሻ ሰው የቤተሰብ ስም",
		contactPersonPosition: "ስራ/ሃላፊነት",
		phone: "ስልክ ቁጥር",
		email: "ኢሜይል አድራሻ",
		alternateEmail: "ተጨማሪ ኢሜይል (አማራጭ)",
		numberOfEmployees: "የሰራተኞች ቁጥር",
		sectorsOfOperation: "የስራ ዘርፎች",
		sectorsPlaceholder: "ምሳሌ፡ ግንበነ፣ አገልጋዮች፣ ጤና አገልግሎት፣ ወዘተ",
		previousHiringExperience: "የቀደሙ የቅጥር ልምድ",
		selectExperience: "ከኢትዮጵያ ሰራተኞችን ለመቅጥር የቀደሙ ልምድ አሎት?",
		yes: "አዎ",
		no: "አይ",
		hiringHistory: "አጭር የቅጥር ታሪክ (አዎ ከሆነ)",
		hiringHistoryPlaceholder: "የቀደምዎን የቅጥር ልምድ ይግለጹ",
		documents: "ሰነዶች ይጫኑ",
		documentsDesc: "ለማረጋገጥ የሚያስፈልጉትን ሰነዶች ይጫኑ (PDF/JPEG, ከ5MB በታች)",
		licenseDocument: "የንግድ ፈቃድ",
		registrationCertificate: "የምዝገባ የምስክር ወረቀት",
		contactPersonPhoto: "የአድራሻ ሰው ፎቶ",
		agreeToTerms: "ከውል እና ሁኔታዎች ጋር ይስማማ",
		previous: "ቀዳሚ",
		next: "ቀጣይ",
		submit: "ምዝገባ ያስገቡ",
		backToSelection: "ወደ ምርጫ ተመለስ",
		success: "ምዝገባ ተሳክቷል!",
		successMsg: "የእርስዎ አሠሪ ID: {id}። ማረጋገጥ በ3-5 የስራ ቀናት ውስጥ ይጀምራል።",
		error: "ምዝገባ ወድቋል። እንደገና ይሞክሩ።",
		loading: "ይላካል...",
	},
};

export default function EmployerRegistrationPage() {
	const router = useRouter();
	const [language, setLanguage] = useState("en");
	const [currentStep, setCurrentStep] = useState(1);
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [employerId, setEmployerId] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const t = translations[language as keyof typeof translations] || translations.en;

	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
		trigger,
	} = useForm<EmployerRegistrationFormData>({
		resolver: zodResolver(employerRegistrationSchema),
		mode: "onChange",
		defaultValues: {
			companyName: "",
			companyType: undefined,
			licenseNumber: "",
			countryOfOperation: "",
			city: "",
			address: "",
			website: "",
			contactPersonFirstName: "",
			contactPersonLastName: "",
			contactPersonPosition: "",
			phone: "",
			email: "",
			alternateEmail: "",
			numberOfEmployees: "",
			sectorsOfOperation: "",
			previousHiringExperience: undefined,
			hiringHistory: "",
			licenseDocument: [],
			registrationCertificate: [],
			contactPersonPhoto: [],
			agreeToTerms: false,
		},
	});

	const previousHiringExperience = watch("previousHiringExperience");
	const licenseDocument = watch("licenseDocument");
	const registrationCertificate = watch("registrationCertificate");
	const contactPersonPhoto = watch("contactPersonPhoto");

	const onSubmit = async (data: EmployerRegistrationFormData) => {
		setStatus("loading");
		setErrorMessage("");

		try {
			const formData = new FormData();
			
			formData.append("companyName", data.companyName);
			formData.append("companyType", data.companyType);
			formData.append("licenseNumber", data.licenseNumber);
			formData.append("countryOfOperation", data.countryOfOperation);
			formData.append("city", data.city);
			formData.append("address", data.address);
			if (data.website) formData.append("website", data.website);
			formData.append("contactPersonFirstName", data.contactPersonFirstName);
			formData.append("contactPersonLastName", data.contactPersonLastName);
			formData.append("contactPersonPosition", data.contactPersonPosition);
			formData.append("phone", data.phone);
			formData.append("email", data.email);
			if (data.alternateEmail) formData.append("alternateEmail", data.alternateEmail);
			formData.append("numberOfEmployees", data.numberOfEmployees);
			formData.append("sectorsOfOperation", data.sectorsOfOperation);
			formData.append("previousHiringExperience", data.previousHiringExperience);
			if (data.hiringHistory) formData.append("hiringHistory", data.hiringHistory);
			if (data.licenseDocument && data.licenseDocument[0]) {
				formData.append("licenseDocument", data.licenseDocument[0]);
			}
			if (data.registrationCertificate && data.registrationCertificate[0]) {
				formData.append("registrationCertificate", data.registrationCertificate[0]);
			}
			if (data.contactPersonPhoto && data.contactPersonPhoto[0]) {
				formData.append("contactPersonPhoto", data.contactPersonPhoto[0]);
			}

			const response = await fetch("http://localhost:5000/api/register/employer", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ 
					message: "Registration failed. Please check your connection and try again." 
				}));
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
				isValid = await trigger(["companyName", "companyType", "licenseNumber", "countryOfOperation", "city", "address"]);
				break;
			case 2:
				isValid = await trigger(["contactPersonFirstName", "contactPersonLastName", "contactPersonPosition", "phone", "email"]);
				break;
			case 3:
				isValid = await trigger(["numberOfEmployees", "sectorsOfOperation", "previousHiringExperience"]);
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
							{t.companySection}
						</h3>

						<FormField label={t.companyName} error={errors.companyName?.message} required>
							<Controller
								name="companyName"
								control={control}
								render={({ field }) => (
									<input
										{...field}
										type="text"
										className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
											errors.companyName ? "border-destructive bg-destructive/5" : "border-border bg-input"
										}`}
										aria-invalid={!!errors.companyName}
									/>
								)}
							/>
						</FormField>

						<div className="grid md:grid-cols-2 gap-4">
							<FormField label={t.companyType} error={errors.companyType?.message} required>
								<Controller
									name="companyType"
									control={control}
									render={({ field }) => (
										<select
											{...field}
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.companyType ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.companyType}
										>
											<option value="">{t.selectCompanyType}</option>
											<option value="Private">{t.private}</option>
											<option value="Government">{t.government}</option>
											<option value="NGO">{t.ngo}</option>
										</select>
									)}
								/>
							</FormField>

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
						</div>

						<div className="grid md:grid-cols-2 gap-4">
							<FormField label={t.countryOfOperation} error={errors.countryOfOperation?.message} required>
								<Controller
									name="countryOfOperation"
									control={control}
									render={({ field }) => (
										<select
											{...field}
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.countryOfOperation ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.countryOfOperation}
										>
											<option value="">{t.selectCountry}</option>
											<option value="UAE">United Arab Emirates</option>
											<option value="Qatar">Qatar</option>
											<option value="Saudi Arabia">Saudi Arabia</option>
											<option value="Kuwait">Kuwait</option>
											<option value="Oman">Oman</option>
											<option value="Bahrain">Bahrain</option>
											<option value="Other">Other</option>
										</select>
									)}
								/>
							</FormField>

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
						</div>

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

						<FormField label={t.website} error={errors.website?.message}>
							<Controller
								name="website"
								control={control}
								render={({ field }) => (
									<input
										{...field}
										type="url"
										placeholder={t.websitePlaceholder}
										className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
											errors.website ? "border-destructive bg-destructive/5" : "border-border bg-input"
										}`}
										aria-invalid={!!errors.website}
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
							<UserCheck className="w-5 h-5" />
							{t.contactSection}
						</h3>

						<div className="grid md:grid-cols-2 gap-4">
							<FormField label={t.contactPersonFirstName} error={errors.contactPersonFirstName?.message} required>
								<Controller
									name="contactPersonFirstName"
									control={control}
									render={({ field }) => (
										<input
											{...field}
											type="text"
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.contactPersonFirstName ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.contactPersonFirstName}
										/>
									)}
								/>
							</FormField>

							<FormField label={t.contactPersonLastName} error={errors.contactPersonLastName?.message} required>
								<Controller
									name="contactPersonLastName"
									control={control}
									render={({ field }) => (
										<input
											{...field}
											type="text"
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.contactPersonLastName ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.contactPersonLastName}
										/>
									)}
								/>
							</FormField>
						</div>

						<FormField label={t.contactPersonPosition} error={errors.contactPersonPosition?.message} required>
							<Controller
								name="contactPersonPosition"
								control={control}
								render={({ field }) => (
									<input
										{...field}
										type="text"
										className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
											errors.contactPersonPosition ? "border-destructive bg-destructive/5" : "border-border bg-input"
										}`}
										aria-invalid={!!errors.contactPersonPosition}
									/>
								)}
							/>
						</FormField>

						<div className="grid md:grid-cols-2 gap-4">
							<FormField label={t.phone} error={errors.phone?.message} required>
								<Controller
									name="phone"
									control={control}
									render={({ field }) => (
										<input
											{...field}
											type="tel"
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

						<FormField label={t.alternateEmail} error={errors.alternateEmail?.message}>
							<Controller
								name="alternateEmail"
								control={control}
								render={({ field }) => (
									<input
										{...field}
										type="email"
										className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
											errors.alternateEmail ? "border-destructive bg-destructive/5" : "border-border bg-input"
										}`}
										aria-invalid={!!errors.alternateEmail}
									/>
								)}
							/>
						</FormField>
					</div>
				);

			case 3:
				return (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
							<Globe className="w-5 h-5" />
							{t.businessSection}
						</h3>

						<FormField label={t.numberOfEmployees} error={errors.numberOfEmployees?.message} required>
							<Controller
								name="numberOfEmployees"
								control={control}
								render={({ field }) => (
									<select
										{...field}
										className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
											errors.numberOfEmployees ? "border-destructive bg-destructive/5" : "border-border bg-input"
										}`}
										aria-invalid={!!errors.numberOfEmployees}
									>
										<option value="">Select range</option>
										<option value="1-10">1-10 employees</option>
										<option value="11-50">11-50 employees</option>
										<option value="51-200">51-200 employees</option>
										<option value="201-500">201-500 employees</option>
										<option value="500+">500+ employees</option>
									</select>
								)}
							/>
						</FormField>

						<FormField label={t.sectorsOfOperation} error={errors.sectorsOfOperation?.message} required>
							<Controller
								name="sectorsOfOperation"
								control={control}
								render={({ field }) => (
									<textarea
										{...field}
										rows={3}
										placeholder={t.sectorsPlaceholder}
										className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
											errors.sectorsOfOperation ? "border-destructive bg-destructive/5" : "border-border bg-input"
										}`}
										aria-invalid={!!errors.sectorsOfOperation}
									/>
								)}
							/>
						</FormField>

						<FormField label={t.previousHiringExperience} error={errors.previousHiringExperience?.message} required>
							<Controller
								name="previousHiringExperience"
								control={control}
								render={({ field }) => (
									<select
										{...field}
										className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
											errors.previousHiringExperience ? "border-destructive bg-destructive/5" : "border-border bg-input"
										}`}
										aria-invalid={!!errors.previousHiringExperience}
									>
										<option value="">{t.selectExperience}</option>
										<option value="Yes">{t.yes}</option>
										<option value="No">{t.no}</option>
									</select>
								)}
							/>
						</FormField>

						{previousHiringExperience === "Yes" && (
							<FormField label={t.hiringHistory} error={errors.hiringHistory?.message}>
								<Controller
									name="hiringHistory"
									control={control}
									render={({ field }) => (
										<textarea
											{...field}
											rows={4}
											placeholder={t.hiringHistoryPlaceholder}
											className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
												errors.hiringHistory ? "border-destructive bg-destructive/5" : "border-border bg-input"
											}`}
											aria-invalid={!!errors.hiringHistory}
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
								render={({ field: { onChange } }) => (
									<input
										type="file"
										accept=".pdf,.jpg,.jpeg"
										onChange={(e) => onChange(Array.from(e.target.files || []))}
										className="hidden"
										id="licenseDocument"
										aria-invalid={!!errors.licenseDocument}
									/>
								)}
							/>
							<label htmlFor="licenseDocument" className="flex items-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
								<Upload className="w-5 h-5 text-muted-foreground" />
								<span className="text-sm text-foreground">{t.licenseDocument} - {licenseDocument?.length > 0 ? `✓ ${licenseDocument[0]?.name}` : "Click to upload"}</span>
							</label>
						</FormField>

						<FormField label={t.registrationCertificate}>
							<Controller
								name="registrationCertificate"
								control={control}
								render={({ field: { onChange } }) => (
									<input
										type="file"
										accept=".pdf,.jpg,.jpeg"
										onChange={(e) => onChange(Array.from(e.target.files || []))}
										className="hidden"
										id="registrationCertificate"
									/>
								)}
							/>
							<label htmlFor="registrationCertificate" className="flex items-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
								<Upload className="w-5 h-5 text-muted-foreground" />
								<span className="text-sm text-foreground">{t.registrationCertificate} (Optional) - {registrationCertificate?.length > 0 ? `✓ ${registrationCertificate[0]?.name}` : "Click to upload"}</span>
							</label>
						</FormField>

						<FormField label={t.contactPersonPhoto}>
							<Controller
								name="contactPersonPhoto"
								control={control}
								render={({ field: { onChange } }) => (
									<input
										type="file"
										accept=".jpg,.jpeg"
										onChange={(e) => onChange(Array.from(e.target.files || []))}
										className="hidden"
										id="contactPersonPhoto"
									/>
								)}
							/>
							<label htmlFor="contactPersonPhoto" className="flex items-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
								<Upload className="w-5 h-5 text-muted-foreground" />
								<span className="text-sm text-foreground">{t.contactPersonPhoto} (Optional) - {contactPersonPhoto?.length > 0 ? `✓ ${contactPersonPhoto[0]?.name}` : "Click to upload"}</span>
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
						<ProgressBar currentStep={currentStep} totalSteps={4} />
					</div>

					{/* Status Messages */}
					{status === "success" && (
						<div className="mb-6 p-4 bg-accent/10 border border-accent rounded-lg flex gap-3">
							<CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
							<div>
								<p className="text-accent font-medium text-sm">{t.success}</p>
								{employerId && (
									<p className="text-accent text-sm mt-1">
										{t.successMsg.replace("{id}", employerId)}
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