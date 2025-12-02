"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SignupModal } from "@/components/signup-modal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, Target, Shield, Zap } from "lucide-react"

type AboutPageProps = {}

const translations = {
  en: {
    title: "About AFA RAMS",
    subtitle: "Supporting Recruitment Agencies Since 2020",
    history: "Our History",
    historyContent:
      "The AFA Recruitment Agency Management System (RAMS) was launched in 2020 to streamline the recruitment process for foreign employment agencies in Ethiopia. By centralizing key processes, it ensures efficient management of candidate registrations, job orders, visa processing, and travel logistics.",
    mission: "Our Mission",
    missionContent:
      "To empower Ethiopian recruitment agencies through technology, improving operational efficiency, compliance, and transparency in the foreign employment lifecycle.",
    values: "Our Core Values",
    value1: "Efficiency - We optimize processes to enhance agency operations.",
    value2: "Transparency - We ensure full visibility into every step of the recruitment process.",
    value3: "Compliance - We adhere to Ethiopian labor and data protection laws.",
    value4: "Innovation - We drive change with cutting-edge technology.",
    team: "Our Team",
    teamContent:
      "Our team comprises developers, system architects, and support specialists who work relentlessly to ensure RAMS delivers value to the recruitment ecosystem. Together, we empower agencies to meet their goals and better serve their candidates.",
    learnMore: "Learn More",
    getInvolved: "Get Started",
  },
  am: {
    title: "ስለ RAMS",
    subtitle: "ከ2023 ጀምሮ ለተቋቋሚ የስራ ማህበረሰቦች እንደ መንገድ ስር ያገለግላል",
    history: "ታሪካችን",
    historyContent:
      "የተቋቋሚ አመታት ስራ እና የወጣቶች እንዲሁም ማንበብ ማህበረሰብ ስለአሁኑ ስለ RAMS ከ2023 ጀምሮ በአምባ ሥራ ማህበረሰቡን ያሳያል",
    mission: "ተልዕኮአችን",
    missionContent:
      "በኢትዮጵያ ስራ ተቋቋሚ አምባ ስራ ማህበረሰቡን እንዲአምበራ የስራ ማህበረሰቡን በተስፋና በማህበረሰቡ ተቋሚ ማንበብ ላይ ማስከበር",
    values: "ዋጋዎቻችን",
    value1: "ችሎታ - እንዲምስል ሁሉንም ሙሉ አሳየን በሰማላ",
    value2: "አባበላል - ሂደታችን ሁሉንም በእስማማ ቦት በማንበብ በጥሩ ስር ነው",
    value3: "ማህበረሰቡን አንድ ተምችላለም",
    value4: "ተማሪነት - ለአምባ ስለምታምራምረነት",
    team: "ቡድናችን",
    teamContent:
      "ቡድን ከሥራ ተምቻውና ሰባቶችን ልክነታ ይእንቀጣ በስለመሳሰሉ እና ዘንዴ ልማት",
    learnMore: "ተጨማሪ ማሳሰብ",
    getInvolved: "ተሳትፎ",
  },
}

export default function AboutPage() {
  const [language, setLanguage] = useState<string>("en")
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  const t = translations[language as keyof typeof translations] || translations.en

  const values = [
    { icon: Heart, title: t.value1.split(" - ")[0], desc: t.value1.split(" - ")[1] },
    { icon: Target, title: t.value2.split(" - ")[0], desc: t.value2.split(" - ")[1] },
    { icon: Shield, title: t.value3.split(" - ")[0], desc: t.value3.split(" - ")[1] },
    { icon: Zap, title: t.value4.split(" - ")[0], desc: t.value4.split(" - ")[1] },
  ]

  return (
    <main className="w-full">
      <Header language={language} onLanguageChange={setLanguage} onSignupClick={() => setIsSignupOpen(true)} />

      <div className="min-h-screen bg-background pt-20 pb-20">
        <div className="bg-gradient-to-b from-primary/10 to-transparent py-12 mb-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{t.title}</h1>
            <p className="text-xl text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4">
          <section id="history" className="mb-20 scroll-mt-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">{t.history}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">{t.historyContent}</p>
              </div>
              <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/im5.png"
                  alt="AFA RAMS History"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </section>

          <section id="mission" className="mb-20 scroll-mt-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative h-80 rounded-lg overflow-hidden shadow-lg order-2 md:order-1">
                <Image
                  src="/im1.png"
                  alt="AFA RAMS Mission"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold text-foreground mb-4">{t.mission}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">{t.missionContent}</p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">{t.values}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="p-6 bg-muted">
                  <div className="flex items-center space-x-4">
                    <value.icon className="h-12 w-12 text-primary" />
                    <div>
                      <h3 className="text-xl font-bold">{value.title}</h3>
                      <p className="text-muted-foreground">{value.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section id="team" className="mb-16 scroll-mt-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">{t.team}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">{t.teamContent}</p>
              <Link href="/get-involved">
  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2">
    {t.getInvolved} ⟶
  </Button>
</Link>

              </div>
              <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/im4.png"
                  alt="ERCS Team"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </section>
          
        </div>
      </div>

      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} language={language} />
      <Footer language={language} />
    </main>
  )
}
