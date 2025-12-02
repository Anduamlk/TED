"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"

interface SignupFormProps {
  language: string
}

const translations = {
  en: {
    title: "Join the ERCS Community",
    subtitle: "Start your humanitarian journey today",
    name: "Full Name",
    namePlaceholder: "Enter your full name",
    email: "Email Address",
    emailPlaceholder: "your@email.com",
    role: "Role",
    selectRole: "Select your role",
    volunteer: "Volunteer",
    member: "Member",
    donor: "Donor",
    staff: "Staff",
    password: "Password",
    passwordPlaceholder: "Create a secure password",
    submit: "Join Now",
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    passwordTooShort: "Password must be at least 8 characters",
    success: "Welcome! Check your email to confirm your account.",
    error: "Something went wrong. Please try again.",
  },
  am: {
    title: "ወደ ERCS ማህበረሰብ ይቀላቀሉ",
    subtitle: "ዛሬ ሰብአዊ ጉዞ ይጀምሩ",
    name: "ሙሉ ስም",
    namePlaceholder: "ሙሉ ስምዎን ያስገቡ",
    email: "ኢሜይል አድራሻ",
    emailPlaceholder: "your@email.com",
    role: "ሚና",
    selectRole: "ሚናዎን ይምረጡ",
    volunteer: "ተvolunteer",
    member: "አባል",
    donor: "ለሂወት ሰጪ",
    staff: "ሰራተኛ",
    password: "ይለፍ ቃል",
    passwordPlaceholder: "ደህንነተ ይለፍ ቃል ይፍጠሩ",
    submit: "አሁን ይቀላቀሉ",
    required: "ይህ መስክ ያስፈልጋል",
    invalidEmail: "ትክክለኛ ኢሜይል አድራሻ ያስገቡ",
    passwordTooShort: "ይለፍ ቃል ቢያንስ 8 ቁምፊዎች መሆን አለበት",
    success: "እንኳን ደህና መጡ! ሂሳብዎን ለማረጋገጥ ኢሜይልዎን ይመልከቱ።",
    error: "ስህተት ተከስቷል። እንደገና ይሞክሩ።",
  },
}

export function SignupForm({ language }: SignupFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

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

    if (!formData.role) {
      newErrors.role = t.required
    }

    if (!formData.password) {
      newErrors.password = t.required
    } else if (formData.password.length < 8) {
      newErrors.password = t.passwordTooShort
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In production, this would call: POST /api/signup
      console.log("Form submitted:", formData)

      setStatus("success")
      setFormData({ name: "", email: "", role: "", password: "" })

      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000)
    } catch (error) {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <section className="w-full py-20 bg-muted">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="p-8 md:p-12 bg-card border border-border shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t.title}</h2>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="mb-6 p-4 bg-accent/10 border border-accent rounded-lg flex gap-3">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-accent font-medium">{t.success}</p>
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-destructive font-medium">{t.error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                {t.name}
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder={t.namePlaceholder}
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.name ? "border-destructive bg-destructive/5" : "border-border bg-input"
                }`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-destructive text-sm mt-2">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                {t.email}
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.email ? "border-destructive bg-destructive/5" : "border-border bg-input"
                }`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-destructive text-sm mt-2">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-foreground mb-2">
                {t.role}
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.role ? "border-destructive bg-destructive/5" : "border-border bg-input"
                }`}
                aria-invalid={!!errors.role}
                aria-describedby={errors.role ? "role-error" : undefined}
              >
                <option value="">{t.selectRole}</option>
                <option value="volunteer">{t.volunteer}</option>
                <option value="member">{t.member}</option>
                <option value="donor">{t.donor}</option>
                <option value="staff">{t.staff}</option>
              </select>
              {errors.role && (
                <p id="role-error" className="text-destructive text-sm mt-2">
                  {errors.role}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                {t.password}
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder={t.passwordPlaceholder}
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.password ? "border-destructive bg-destructive/5" : "border-border bg-input"
                }`}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <p id="password-error" className="text-destructive text-sm mt-2">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Loading..." : t.submit}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  )
}
