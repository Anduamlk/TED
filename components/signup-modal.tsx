"use client"

import type React from "react"
import { useState } from "react"
import { X, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
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
    close: "Close",
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
    close: "ዝጋ",
  },
}

export function SignupModal({ isOpen, onClose, language }: SignupModalProps) {
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
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Form submitted:", formData)

      setStatus("success")
      setFormData({ name: "", email: "", role: "", password: "" })

      setTimeout(() => {
        setStatus("idle")
        onClose()
      }, 2000)
    } catch (error) {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md bg-card border border-border shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t.title}</h2>
            <p className="text-muted-foreground text-sm">{t.subtitle}</p>
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="mb-6 p-4 bg-accent/10 border border-accent rounded-lg flex gap-3">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-accent font-medium text-sm">{t.success}</p>
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-destructive font-medium text-sm">{t.error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-1">
                {t.name}
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder={t.namePlaceholder}
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.name ? "border-destructive bg-destructive/5" : "border-border bg-input"
                }`}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-1">
                {t.email}
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.email ? "border-destructive bg-destructive/5" : "border-border bg-input"
                }`}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-foreground mb-1">
                {t.role}
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.role ? "border-destructive bg-destructive/5" : "border-border bg-input"
                }`}
                aria-invalid={!!errors.role}
              >
                <option value="">{t.selectRole}</option>
                <option value="volunteer">{t.volunteer}</option>
                <option value="member">{t.member}</option>
                <option value="donor">{t.donor}</option>
                <option value="staff">{t.staff}</option>
              </select>
              {errors.role && <p className="text-destructive text-xs mt-1">{errors.role}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-1">
                {t.password}
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder={t.passwordPlaceholder}
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.password ? "border-destructive bg-destructive/5" : "border-border bg-input"
                }`}
                aria-invalid={!!errors.password}
              />
              {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {status === "loading" ? "Loading..." : t.submit}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
