"use client"

import type React from "react"
import { useState } from "react"
import { X, AlertCircle, CheckCircle, Eye, EyeOff, User, Mail, Lock, Building, Briefcase, UserCog, Building2, Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  language: string
}

const translations = {
  en: {
    title: "Join TEDBEER RAMS Platform",
    subtitle: "Choose your registration type and start streamlining your recruitment operations",
    name: "Full Name",
    namePlaceholder: "Enter your full name",
    email: "Email Address",
    emailPlaceholder: "your@email.com",
    phone: "Phone Number",
    phonePlaceholder: "+251 91 234 5678",
    role: "Register As",
    selectRole: "Select registration type",
    candidate: "Candidate",
    employer: "Employer",
    agency: "Recruitment Agency",
    admin: "System Administrator",
    password: "Password",
    passwordPlaceholder: "Create a secure password",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your password",
    terms: "I agree to the Terms of Service and Privacy Policy",
    submit: "Create Account",
    signup: "Sign Up",
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    invalidPhone: "Please enter a valid phone number",
    passwordTooShort: "Password must be at least 8 characters",
    passwordMismatch: "Passwords do not match",
    success: "Account created successfully! Check your email to confirm your account.",
    error: "Something went wrong. Please try again.",
    close: "Close",
    country: "Country",
    selectCountry: "Select your country",
    ethiopia: "Ethiopia",
    other: "Other",
    organization: "Organization Name",
    organizationPlaceholder: "Enter organization name",
    position: "Position",
    positionPlaceholder: "Enter your position",
    agencyName: "Agency Name",
    agencyNamePlaceholder: "Enter agency name",
    licenseNumber: "License Number",
    licenseNumberPlaceholder: "Enter agency license number",
    yearsExperience: "Years of Experience",
    industry: "Industry",
    selectIndustry: "Select industry",
    construction: "Construction",
    healthcare: "Healthcare",
    hospitality: "Hospitality",
    manufacturing: "Manufacturing",
    it: "Information Technology",
  },
  am: {
    title: "ወደ TEDBEER RAMS ፕላትፎርም ይቀላቀሉ",
    subtitle: "የምዝገባ አይነትዎን ይምረጡ እና የሥራ አሰጣጥ ስራዎችዎን ማሻሻል ይጀምሩ",
    name: "ሙሉ ስም",
    namePlaceholder: "ሙሉ ስምዎን ያስገቡ",
    email: "ኢሜይል አድራሻ",
    emailPlaceholder: "your@email.com",
    phone: "ስልክ ቁጥር",
    phonePlaceholder: "+251 91 234 5678",
    role: "እንደ ይመዝገቡ",
    selectRole: "የምዝገባ አይነት ይምረጡ",
    candidate: "እጩ",
    employer: "አሰሪ",
    agency: "የሥራ አጥላቂ አጀንዲ",
    admin: "ሲስተም አስተዳዳሪ",
    password: "የይለፍ ቃል",
    passwordPlaceholder: "ደህንነተ ይለፍ ቃል ይፍጠሩ",
    confirmPassword: "የይለፍ ቃል ያረጋግጡ",
    confirmPasswordPlaceholder: "የይለፍ ቃልዎን እንደገና ያስገቡ",
    terms: "የአገልግሎት ውል እና የግላዊነት ፖሊሲ አስማማሁ",
    submit: "መለያ ይፍጠሩ",
    signup: "ይመዝገቡ",
    required: "ይህ መስክ ያስፈልጋል",
    invalidEmail: "ትክክለኛ ኢሜይል አድራሻ ያስገቡ",
    invalidPhone: "ትክክለኛ ስልክ ቁጥር ያስገቡ",
    passwordTooShort: "የይለፍ ቃል ቢያንስ 8 ቁምፊዎች መሆን አለበት",
    passwordMismatch: "የይለፍ ቃሎች አይዛመዱም",
    success: "መለያ በተሳካ ሁኔታ ተፈጥሯል! መለያዎን ለማረጋገጥ ኢሜይልዎን ይመልከቱ።",
    error: "ስህተት ተከስቷል። እንደገና ይሞክሩ።",
    close: "ዝጋ",
    country: "አገር",
    selectCountry: "አገርዎን ይምረጡ",
    ethiopia: "ኢትዮጵያ",
    other: "ሌላ",
    organization: "የድርጅት ስም",
    organizationPlaceholder: "የድርጅት ስም ያስገቡ",
    position: "ስራ",
    positionPlaceholder: "ስራዎን ያስገቡ",
    agencyName: "የአጀንዲ ስም",
    agencyNamePlaceholder: "የአጀንዲ ስም ያስገቡ",
    licenseNumber: "የፈቃድ ቁጥር",
    licenseNumberPlaceholder: "የአጀንዲ ፈቃድ ቁጥር ያስገቡ",
    yearsExperience: "የልምድ ዓመታት",
    industry: "ኢንዱስትሪ",
    selectIndustry: "ኢንዱስትሪ ይምረጡ",
    construction: "ግንባታ",
    healthcare: "ጤና እንክብካቤ",
    hospitality: "እንግዳ ተቀባይነት",
    manufacturing: "ማምረቻ",
    it: "መረጃ ቴክኖሎጂ",
  },
}

const roleIcons = {
  candidate: User,
  employer: Building,
  agency: Building2,
  admin: UserCog,
}

export function SignupModal({ isOpen, onClose, language }: SignupModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
    country: "",
    organization: "",
    position: "",
    agencyName: "",
    licenseNumber: "",
    yearsExperience: "",
    industry: "",
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const t = translations[language as keyof typeof translations] || translations.en

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = t.required
    }

    if (!formData.email.trim()) {
      newErrors.email = t.required
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.invalidEmail
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t.required
    } else if (!/^\+?[\d\s\-\(\)]{8,}$/.test(formData.phone)) {
      newErrors.phone = t.invalidPhone
    }

    if (!formData.role) {
      newErrors.role = t.required
    }

    if (!formData.password) {
      newErrors.password = t.required
    } else if (formData.password.length < 8) {
      newErrors.password = t.passwordTooShort
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t.required
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.passwordMismatch
    }

    if (!agreedToTerms) {
      newErrors.terms = t.required
    }

    // Role-specific validations
    if (formData.role === "employer" && !formData.organization.trim()) {
      newErrors.organization = t.required
    }

    if (formData.role === "agency") {
      if (!formData.agencyName.trim()) newErrors.agencyName = t.required
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = t.required
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setStatus("loading")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Form submitted:", formData)

      setStatus("success")
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
        password: "",
        confirmPassword: "",
        country: "",
        organization: "",
        position: "",
        agencyName: "",
        licenseNumber: "",
        yearsExperience: "",
        industry: "",
      })
      setAgreedToTerms(false)

      setTimeout(() => {
        setStatus("idle")
        onClose()
      }, 3000)
    } catch (error) {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleRoleSelect = (role: string) => {
    setFormData((prev) => ({ ...prev, role }))
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: "" }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-blue-900/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl mx-auto">
        <Card className="relative bg-gradient-to-br from-white to-blue-50/50 border border-blue-200/50 shadow-2xl rounded-2xl overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-blue-100/50 rounded-full transition-all duration-300 hover:scale-110"
            aria-label={t.close}
          >
            <X className="w-5 h-5 text-blue-600" />
          </button>

          {/* Background pattern */}
          <div className="absolute inset-0 bg-grid-blue-500/[0.02] bg-[size:20px_20px]" />

          {/* Modal Content */}
          <div className="relative p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full mb-4">
                <Check className="w-4 h-4" />
                <span>Join TEDBEER RAMS</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                {t.title}
              </h2>
              
              <p className="text-gray-600 max-w-lg mx-auto">
                {t.subtitle}
              </p>
            </div>

            {/* Status Messages */}
            {status === "success" && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in fade-in">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-green-800 font-medium">{t.success}</p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl flex items-center gap-3 animate-in fade-in">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-red-800 font-medium">{t.error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t.role}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(["candidate", "employer", "agency", "admin"] as const).map((role) => {
                    const Icon = roleIcons[role]
                    const isSelected = formData.role === role
                    
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleSelect(role)}
                        className={`
                          p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-50 shadow-md scale-105' 
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm'
                          }
                        `}
                      >
                        <div className={`
                          w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300
                          ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}
                        `}>
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                        </div>
                        <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                          {t[role]}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {errors.role && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.role}
                  </p>
                )}
              </div>

              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.name}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder={t.namePlaceholder}
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border-2 text-sm transition-all duration-200 focus:outline-none ${
                        errors.name 
                          ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                          : 'border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                      }`}
                      aria-invalid={!!errors.name}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-2">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.email}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder={t.emailPlaceholder}
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border-2 text-sm transition-all duration-200 focus:outline-none ${
                        errors.email 
                          ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                          : 'border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                      }`}
                      aria-invalid={!!errors.email}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-2">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.phone}
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder={t.phonePlaceholder}
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-3 rounded-lg border-2 text-sm transition-all duration-200 focus:outline-none ${
                        errors.phone 
                          ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                          : 'border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                      }`}
                      aria-invalid={!!errors.phone}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-2">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.country}
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded-lg border-2 border-gray-200 bg-white text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">{t.selectCountry}</option>
                    <option value="ethiopia">{t.ethiopia}</option>
                    <option value="other">{t.other}</option>
                  </select>
                </div>
              </div>

              {/* Role-specific fields */}
              {formData.role === "employer" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="organization" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.organization}
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="organization"
                        type="text"
                        name="organization"
                        placeholder={t.organizationPlaceholder}
                        value={formData.organization}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-3 rounded-lg border-2 text-sm transition-all duration-200 focus:outline-none ${
                          errors.organization 
                            ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                            : 'border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                        }`}
                      />
                    </div>
                    {errors.organization && (
                      <p className="text-red-600 text-sm mt-2">{errors.organization}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.industry}
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-3 py-3 rounded-lg border-2 border-gray-200 bg-white text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">{t.selectIndustry}</option>
                      <option value="construction">{t.construction}</option>
                      <option value="healthcare">{t.healthcare}</option>
                      <option value="hospitality">{t.hospitality}</option>
                      <option value="manufacturing">{t.manufacturing}</option>
                      <option value="it">{t.it}</option>
                    </select>
                  </div>
                </div>
              )}

              {formData.role === "agency" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="agencyName" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.agencyName}
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="agencyName"
                        type="text"
                        name="agencyName"
                        placeholder={t.agencyNamePlaceholder}
                        value={formData.agencyName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-3 rounded-lg border-2 text-sm transition-all duration-200 focus:outline-none ${
                          errors.agencyName 
                            ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                            : 'border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                        }`}
                      />
                    </div>
                    {errors.agencyName && (
                      <p className="text-red-600 text-sm mt-2">{errors.agencyName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.licenseNumber}
                    </label>
                    <input
                      id="licenseNumber"
                      type="text"
                      name="licenseNumber"
                      placeholder={t.licenseNumberPlaceholder}
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 rounded-lg border-2 text-sm transition-all duration-200 focus:outline-none ${
                        errors.licenseNumber 
                          ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                          : 'border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                    {errors.licenseNumber && (
                      <p className="text-red-600 text-sm mt-2">{errors.licenseNumber}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Password Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.password}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder={t.passwordPlaceholder}
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 rounded-lg border-2 text-sm transition-all duration-200 focus:outline-none ${
                        errors.password 
                          ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                          : 'border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-2">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.confirmPassword}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder={t.confirmPasswordPlaceholder}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 rounded-lg border-2 text-sm transition-all duration-200 focus:outline-none ${
                        errors.confirmPassword 
                          ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                          : 'border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-2">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    {t.terms}
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 
                  text-white text-lg font-semibold py-6 rounded-xl transition-all duration-300 
                  hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-lg"
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    {t.submit}
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </span>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={() => {
                    onClose()
                    // You can add navigation to login page here
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}