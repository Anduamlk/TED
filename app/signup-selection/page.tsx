"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SelectionCard } from "@/components/selection-card"
import { User, Briefcase, Building2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const translations = {
  en: {
    title: "Register with TEDBEER Platform",
    subtitle: "Select your account type to begin your recruitment journey",
    candidateTitle: "Register as Candidate",
    candidateDesc: "Search for overseas job opportunities, manage your profile, and track your visa processing status.",
    candidateBtn: "Register as Candidate",
    employerTitle: "Register as Employer",
    employerDesc: "Post job orders, review candidates, and manage your recruitment requirements with qualified talent.",
    employerBtn: "Register as Employer",
    agencyTitle: "Register as Agency",
    agencyDesc: "Manage end-to-end recruitment processes, handle candidate placement, and ensure compliance with regulations.",
    agencyBtn: "Register as Agency",
    backHome: "Back to Home",
  },
  am: {
    title: "RAMS የአድራሻ ስርዓት ይመዝገቡ",
    subtitle: "አይነት ይምረጡ ለመጀመር ቅጥር ጉዞዎን",
    candidateTitle: "እንደ እጩ ይመዝገቡ",
    candidateDesc: "የውጭ ስራ ዕድሎችን ይፈልጉ፣ መገለጫዎን ያቀናብሩ እና የቪዛ አሰራር ሁኔታዎን ይከታተሉ።",
    candidateBtn: "እንደ እጩ ይመዝገቡ",
    employerTitle: "እንደ አሠሪ ይመዝገቡ",
    employerDesc: "የስራ ትእዛዞችን ይለጥፉ፣ እጩዎችን ይገምግሙ እና የቅጥር መስፈርቶችዎን ከብቃት ያለው ብቃት ጋር ያቀናብሩ።",
    employerBtn: "እንደ አሠሪ ይመዝገቡ",
    agencyTitle: "እንደ አጀንዲ ይመዝገቡ",
    agencyDesc: "ከመጀመሪያ እስከ መጨረሻ የቅጥር ሂደቶችን ያቀናብሩ፣ የእጩ ምቾት ያስተዳድሩ እና ከደንቦች ጋር መገጣጠም ያረጋገጡ።",
    agencyBtn: "እንደ አጀንዲ ይመዝገቡ",
    backHome: "ወደ ቤት ተመለስ",
  },
}

export default function SignupSelectionPage() {
  const router = useRouter()
  const [language, setLanguage] = useState("en")

  const t = translations[language as keyof typeof translations] || translations.en

  return (
    <main className="w-full min-h-screen flex flex-col pt-35">
      <Header language={language} onLanguageChange={setLanguage} onSignupClick={() => {}} />

      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{t.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
          </div>
        </section>

        {/* Selection Cards */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <SelectionCard
                icon={<User className="w-12 h-12 text-primary" />}
                title={t.candidateTitle}
                description={t.candidateDesc}
                buttonText={t.candidateBtn}
                onClick={() => router.push("/register/candidate")}
              />
              <SelectionCard
                icon={<Briefcase className="w-12 h-12 text-primary" />}
                title={t.employerTitle}
                description={t.employerDesc}
                buttonText={t.employerBtn}
                onClick={() => router.push("/register/employer")}
              />
              <SelectionCard
                icon={<Building2 className="w-12 h-12 text-primary" />}
                title={t.agencyTitle}
                description={t.agencyDesc}
                buttonText={t.agencyBtn}
                onClick={() => router.push("/register/agency")}
              />
            </div>

            {/* Back to Home */}
            <div className="text-center mt-12">
              <Link href="/" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                ← {t.backHome}
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer language={language} />
    </main>
  )
}

