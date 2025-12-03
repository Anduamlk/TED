"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SignupModal } from "@/components/signup-modal"
import { Card } from "@/components/ui/card"
import Link from "next/link" 
import { Button } from "@/components/ui/button"
import { Heart, AlertTriangle, Users, Zap, TrendingUp, Globe } from "lucide-react"
import { Candidate } from "@/backend/src/candidate/candidate.entity"
import { Employer } from "@/backend/src/employer/employer.entity"

const translations = {
  en: {
    title: "Transform the way you recruit",
    subtitle: "Efficient Recruitment and Candidate Tracking",
    programs: "Our Core Functionalities",
    disasterResponse: "Candidate Registration & Profiling",
    disasterResponseDesc:
      "Streamlining the end-to-end candidate lifecycle, from registration to deployment. This includes profiling candidates based on skills, preferences, and destination country.",
    healthCampaigns: "Visa & Compliance Management",
    healthCampaignsDesc:
      "Automating visa status tracking, document verification (e.g., passport, medical), and compliance monitoring for smooth processing.",
    communityDevelopment: "Job Order Management",
    communityDevelopmentDesc:
      "Efficient tracking of job orders from overseas employers, including job titles, quotas, and salary information, ensuring accurate candidate placement.",
    emergencyRelief: "Travel & Deployment Logistics",
    emergencyReliefDesc:
      "Managing all travel logistics including flight bookings, pre-departure checklists, and candidate orientation for smooth deployments.",
    impact: "System Impact & Metrics",
    impactStories: "Impact Stories from Employers and Candidates",
    aided: "Candidates Placed in 2024",
    agency: "Active Agency Partners",
    employer: "Job Orders Processed",
    reach: "Global Reach",
    getInvolved: "Get Started with TEDBEER",
  },
}

export default function WhatWeDoPage() {
  const [language, setLanguage] = useState<string>("en")
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [hoveredProgram, setHoveredProgram] = useState<number | null>(null)

  const t = translations[language as keyof typeof translations] || translations.en

  const programs = [
    {
      icon: Users,
      title: t.disasterResponse,
      description: t.disasterResponseDesc,
      image: "/r1.png",
      color: "from-red-500/20 to-red-500/5",
    },
    {
      icon: Users,
      title: t.communityDevelopment,
      description: t.communityDevelopmentDesc,
      image: "/r4.jpg",
      color: "from-blue-500/20 to-blue-500/5",
    },
    {
      icon: Zap,
      title: t.emergencyRelief,
      description: t.emergencyReliefDesc,
      image: "/r3.png",
      color: "from-blue-500/20 to-blue-500/5",
    },
      {
      icon: Heart,
      title: t.healthCampaigns,
      description: t.healthCampaignsDesc,
      image: "/r2.png",
      color: "from-pink-500/20 to-pink-500/5",
    },
  ]

  const stats = [
    { icon: TrendingUp, label: t.aided, value: "1000+", color: "text-red-500" },
    { icon: Users, label: t.employer, value: "400+", color: "text-blue-500" },
    { icon: Zap, label: t.agency, value: "50+", color: "text-yellow-500" },
    { icon: Globe, label: t.reach, value: "All Regions", color: "text-green-500" },
  ]

  return (
    <main className="w-full">
      <Header language={language} onLanguageChange={setLanguage} onSignupClick={() => setIsSignupOpen(true)} />

      <div className="min-h-screen bg-background pt-35 pb-20">
        <div className="bg-gradient-to-b from-primary/10 to-transparent py-12 mb-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{t.title}</h1>
            <p className="text-xl text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <section id="programs" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">{t.programs}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {programs.map((program, idx) => {
                const Icon = program.icon
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredProgram(idx)}
                    onMouseLeave={() => setHoveredProgram(null)}
                    className="group cursor-pointer"
                  >
                    <Card
                      className={`overflow-hidden border border-border transition-all duration-300 h-full ${
                        hoveredProgram === idx ? "shadow-2xl border-primary/50 scale-105" : "hover:shadow-lg"
                      }`}
                    >
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br">
                        <Image
                          src={program.image || "/placeholder.svg"}
                          alt={program.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-br ${program.color}`} />
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Icon className="w-8 h-8 text-primary flex-shrink-0" />
                          <h3 className="text-xl font-bold text-foreground">{program.title}</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{program.description}</p>
                        <div className="mt-4 pt-4 border-t border-border">
                          <Button
                            variant="ghost"
                            className="text-primary hover:text-primary/80 p-0 h-auto font-semibold"
                          >
                            Learn More →
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                )
              })}
            </div>
          </section>

          <section id="impact" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">{t.impact}</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <Card
                    key={idx}
                    className="p-8 bg-gradient-to-br from-card to-card/50 border border-border hover:shadow-lg hover:border-primary/50 transition-all duration-300 text-center group"
                  >
                    <Icon
                      className={`w-12 h-12 ${stat.color} mx-auto mb-4 group-hover:scale-110 transition-transform`}
                    />
                    <p className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform origin-center">
                      {stat.value}
                    </p>
                    <p className="text-muted-foreground font-medium">{stat.label}</p>
                  </Card>
                )
              })}
            </div>
          </section>

          <section className="text-center py-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
            <h3 className="text-2xl font-bold text-foreground mb-4">{t.impactStories}</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of  Employers and Candidates making a real difference in communities across Ethiopia.
            </p>
                        <Link href="/get-involved">
  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2">
    {t.getInvolved}
  </Button>
</Link>
          </section>
        </div>
      </div>

      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} language={language} />
      <Footer language={language} />
    </main>
  )
}
