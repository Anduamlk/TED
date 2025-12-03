"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SignupModal } from "@/components/signup-modal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Briefcase, Building2, CheckCircle, Globe, Shield ,FileText} from "lucide-react"
import Link from "next/link"

const translations = {
  en: {
    title: "Join TEDBEER Platform",
    subtitle: "Register your account and start your journey",
    candidateTitle: "Register as Candidate",
    candidateDesc: "Search and apply for overseas job opportunities. Upload your documents, track your application status, and get matched with international employers.",
    candidateFeatures: [
      "Create your profile with skills and preferences",
      "Track visa processing status",
      "Upload required documents",
      "Receive job notifications",
      "Self-service portal access",
    ],
    candidateCTA: "Register as Candidate",
    employerTitle: "Register as Employer",
    employerDesc: "Post job orders, review candidates, and manage your recruitment needs. Connect with qualified talent from Ethiopia for overseas positions.",
    employerFeatures: [
      "Post unlimited job orders",
      "Review candidate profiles",
      "Manage job quotas and demands",
      "Track candidate fulfillment",
      "Access recruitment analytics",
    ],
    employerCTA: "Register as Employer",
    agencyTitle: "Register as Agency",
    agencyDesc: "Manage end-to-end recruitment processes. Register candidates, process visas, handle travel logistics, and ensure compliance with Ethiopian regulations.",
    agencyFeatures: [
      "Full candidate lifecycle management",
      "Visa and document tracking",
      "Travel logistics coordination",
      "Compliance and regulatory reporting",
      "Multi-country placement support",
    ],
    agencyCTA: "Register as Agency",
    whyTitle: "Why Choose TEDBEER?",
    whyDesc: "Comprehensive solution for overseas employment management",
    security: "Secure & Compliant",
    securityDesc: "Data privacy compliant with Ethiopian regulations and international standards",
    efficient: "Streamlined Workflow",
    efficientDesc: "Automated processes for faster candidate placement and visa processing",
    support: "24/7 Support",
    supportDesc: "Dedicated support team for all users throughout the recruitment journey",
    countries: "Coverage Countries",
    countriesDesc: "Dubai, Qatar, Saudi Arabia, and other destination countries",
  },
  am: {
    title: "RAMS የአድራሻ ስርዓት ይቀላቀሉ",
    subtitle: "መለያዎን ይመዝግቡ እና ጉዞዎን ይጀምሩ",
    candidateTitle: "እንደ እጩ ይመዝገቡ",
    candidateDesc: "የውጭ ስራ ዕድሎችን ፈልግ እና ማመልከት. ሰነዶችዎን ይጭኑ፣ የመኖሪያ ማመልከቻ ሁኔታዎን ይከታተሉ እና ከዓለም አቀፍ አሠሪዎች ጋር ይመዛዘኑ።",
    candidateFeatures: [
      "ክህሎቶች እና ምርጫዎች ያላቸው መገለጫ ይፍጠሩ",
      "የቪዛ አሰራር ሁኔታ ይከታተሉ",
      "የሚፈለጉትን ሰነዶች ይጭኑ",
      "የስራ ማሳወቂያዎች ይቀበሉ",
      "የራስ አገልግሎት መዳረሻ",
    ],
    candidateCTA: "እንደ እጩ ይመዝገቡ",
    employerTitle: "እንደ አሠሪ ይመዝገቡ",
    employerDesc: "የስራ ትእዛዞችን ይለጥፉ፣ እጩዎችን ይገምግሙ እና የቅጥር ፍላጎታችሁን ያቀናብሩ። ከኢትዮጵያ ለውጭ የሚወጡ ሚዛናዊ ብቃት ያላቸው ሰዎች ያግኙ።",
    employerFeatures: [
      "ያልተገደቡ የስራ ትእዛዞችን ይለጥፉ",
      "የእጩ መገለጫዎችን ይገምግሙ",
      "የስራ ኮታዎችን እና ፍላጎቶችን ያቀናብሩ",
      "የእጩ ማሟላትን ይከታተሉ",
      "የቅጥር ትንተናዎችን ይግቡ",
    ],
    employerCTA: "እንደ አሠሪ ይመዝገቡ",
    agencyTitle: "እንደ አጀንዲ ይመዝገቡ",
    agencyDesc: "ከመጀመሪያ እስከ መጨረሻ የቅጥር ሂደቶችን ያቀናብሩ። እጩዎችን ይመዝገቡ፣ ቪዛዎችን ለማሰራር፣ የጉዞ ምቾትን ያቀናብሩ እና ከኢትዮጵያ ደንቦች ጋር መገጣጠም ያረጋገጡ።",
    agencyFeatures: [
      "ሙሉ የእጩ የህይወት ዑደት አስተዳደር",
      "የቪዛ እና የሰነድ ዕይታ",
      "የጉዞ ምቾት ማመቻቸት",
      "አገዛዝ እና የደንብ ሪፖርት",
      "ሙሉ የሀገር ውስጥ ምቾት ድጋፍ",
    ],
    agencyCTA: "እንደ አጀንዲ ይመዝገቡ",
    whyTitle: "ለምን RAMS ይምረጡ?",
    whyDesc: "ለውጭ የስራ አድራሻ አስተዳደር የተዘጋጀ ስርዓት",
    security: "ደህንነት እና መገጣጠም",
    securityDesc: "ከኢትዮጵያ ደንቦች እና አለም አቀፍ ደረጃዎች ጋር የውሂብ ግላዊነት አገጣጠም",
    efficient: "ውጤታማ የስራ ሂደት",
    efficientDesc: "ለፈጣን እጩ ምቾት እና የቪዛ አሰራር ራስ-ሰር ሂደቶች",
    support: "24/7 ድጋፍ",
    supportDesc: "በመላው የቅጥር ጉዞ ለሁሉም ተጠቃሚዎች የተለየ ድጋፍ ቡድን",
    countries: "ሽፋን ሀገሮች",
    countriesDesc: "ዱባይ፣ ቃታር፣ ሳውዲ አረቢያ እና ሌሎች መድረሻ ሀገሮች",
  },
}

export default function GetInvolvedPage() {
  const [language, setLanguage] = useState<string>("en")
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  const t = translations[language as keyof typeof translations] || translations.en

  const registrationTypes = [
    {
      icon: User,
      title: t.candidateTitle,
      description: t.candidateDesc,
      features: t.candidateFeatures,
      cta: t.candidateCTA,
      route: "/register/candidate",
    },
    {
      icon: Briefcase,
      title: t.employerTitle,
      description: t.employerDesc,
      features: t.employerFeatures,
      cta: t.employerCTA,
      route: "/register/employer",
    },
    {
      icon: Building2,
      title: t.agencyTitle,
      description: t.agencyDesc,
      features: t.agencyFeatures,
      cta: t.agencyCTA,
      route: "/register/agency",
    },
  ]

  const whyChoose = [
    {
      icon: Shield,
      title: t.security,
      description: t.securityDesc,
    },
    {
      icon: FileText,
      title: t.efficient,
      description: t.efficientDesc,
    },
    {
      icon: Globe,
      title: t.support,
      description: t.supportDesc,
    },
    {
      icon: CheckCircle,
      title: t.countries,
      description: t.countriesDesc,
    },
  ]

  return (
    <main className="w-full">
      <Header language={language} onLanguageChange={setLanguage} onSignupClick={() => setIsSignupOpen(true)} />

      <div className="min-h-screen bg-background pt-35 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{t.title}</h1>
            <p className="text-lg text-muted-foreground">{t.subtitle}</p>
          </div>

          {/* Registration Types */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {registrationTypes.map((type, idx) => {
              const Icon = type.icon
              return (
                <Card key={idx} className="p-6 bg-card border border-border hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-3">{type.title}</h2>
                  <p className="text-muted-foreground mb-4 text-sm">{type.description}</p>
                  <ul className="space-y-2 mb-6">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={type.route}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      {type.cta}
                    </Button>
                  </Link>
                </Card>
              )
            })}
          </div>

          {/* Why Choose RAMS */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-3 text-center">{t.whyTitle}</h2>
            <p className="text-muted-foreground text-center mb-8">{t.whyDesc}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChoose.map((item, idx) => {
                const Icon = item.icon
                return (
                  <Card key={idx} className="p-6 bg-card border border-border text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 mx-auto">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} language={language} />
      <Footer language={language} />
    </main>
  )
}

