"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SignupModal } from "@/components/signup-modal"
import { Card } from "@/components/ui/card"
import Link from "next/link" 
import { Button } from "@/components/ui/button"
import { 
  Users, Zap, Heart, Briefcase, 
  Plane, FileCheck, Target, Globe,
  TrendingUp, CheckCircle, ArrowRight,
  BarChart, Shield, Clock, Award
} from "lucide-react"

const translations = {
  en: {
    title: "Powerful Recruitment Solutions",
    subtitle: "Streamline Your Agency Operations with TEDBEER",
    tagline: "All-in-One Digital Platform for Ethiopian Recruitment Agencies",
    programs: "Core Platform Features",
    disasterResponse: "Candidate Registration & Profiling",
    disasterResponseDesc: "Comprehensive candidate management system with AI-powered profiling, skill matching, and complete lifecycle tracking from registration to deployment.",
    healthCampaigns: "Visa & Compliance Management",
    healthCampaignsDesc: "Automated visa processing, document verification, and compliance monitoring to ensure smooth and lawful international placements.",
    communityDevelopment: "Job Order Management",
    communityDevelopmentDesc: "Efficient tracking of overseas job orders with real-time updates, quota management, and automated candidate matching algorithms.",
    emergencyRelief: "Travel & Deployment Logistics",
    emergencyReliefDesc: "End-to-end travel management including flight bookings, pre-departure orientations, and complete deployment tracking.",
    advancedFeatures: "Advanced Capabilities",
    feature1: "Real-time Analytics Dashboard",
    feature1Desc: "Monitor key metrics, track performance, and generate detailed reports with our powerful analytics tools.",
    feature2: "Secure Document Management",
    feature2Desc: "Bank-level encryption for all candidate documents with automated expiration alerts and compliance tracking.",
    feature3: "Multi-language Support",
    feature3Desc: "Full platform support in English and Amharic with additional language options for candidate interfaces.",
    feature4: "Mobile Accessibility",
    feature4Desc: "Access your dashboard and manage operations on-the-go with our responsive mobile interface.",
    impact: "Platform Impact & Metrics",
    impactStories: "Success Stories from Our Partners",
    aided: "Candidates Placed",
    agency: "Partner Agencies",
    employer: "Overseas Employers",
    reach: "Countries Covered",
    getInvolved: "Get Started Today",
    ctaTitle: "Ready to Transform Your Recruitment Agency?",
    ctaSubtitle: "Join 100+ successful agencies using TEDBEER",
    startTrial: "Start Free Trial",
    scheduleDemo: "Watch Demo",
    benefits: [
      "Increase operational efficiency by 70%",
      "Reduce processing time by 60%",
      "Improve candidate satisfaction by 85%",
      "Ensure 100% compliance with regulations"
    ]
  },
  am: {
    title: "ውጤታማ የሪክሩትመንት አስተዳደር መፍትሄዎች",
    subtitle: "የኤጀንሲዎትን ሥራ በ TEDBEER ያቀናብሩ",
    tagline: "ሁሉንም በአንድ የሚያደርግ ዲጂታል መድረክ ለኢትዮጵያውያን ሪክሩትመንት ኤጀንሲዎች",
    programs: "ዋና ዋና ባህሪያት",
    disasterResponse: "የእጩ ምዝገባ እና ፕሮፋይል",
    disasterResponseDesc: "የሙሉ የሕይወት ዑደት እጩ አስተዳደር ስርዓት ከAI የሚመራ ፕሮፋይሊንግ፣ ክህሎት ማስመጣት እና ሙሉ የሕይወት ዑደት መከታተያ ጋር።",
    healthCampaigns: "የቪዛ እና ሕጋዊነት አስተዳደር",
    healthCampaignsDesc: "በራስ-ሰር የሚሰራ የቪዛ ሂደት፣ የሰነድ ማረጋገጫ እና ሕጋዊነት መከታተያ ለስላሳ እና ሕጋዊ ዓለም አቀፍ ምደባዎች ለማረጋገጥ።",
    communityDevelopment: "የስራ ትዕዛዝ አስተዳደር",
    communityDevelopmentDesc: "በተጨባጭ ጊዜ ዝማኔዎች፣ ኮታ አስተዳደር እና በራስ-ሰር የሚሰራ የእጩ ማስመጣት አልጎሪዝም ያለው ውጤታማ የውጭ ስራ ትዕዛዞች መከታተያ።",
    emergencyRelief: "የጉዞ እና የማሰማራት ሎጂስቲክስ",
    emergencyReliefDesc: "ከበረራ ቦቂ ማድረግ ጀምሮ እስከ ማሰማራት መከታተያ ድረስ የሚያስተዳድር የመጨረሻ-እስከ-መጨረሻ የጉዞ አስተዳደር ስርዓት።",
    advancedFeatures: "የላቀ ችሎታዎች",
    feature1: "ቅጽበታዊ የትንታኔ ዳሽቦርድ",
    feature1Desc: "ዋና ዋና መለኪያዎችን ይከታተሉ፣ አፈፃፀምን ይከታተሉ እና ዝርዝር ሪፖርቶችን በኃይለኛው የትንታኔ መሳሪያችን ይፍጠሩ።",
    feature2: "ደህንነቱ የተጠበቀ የሰነድ አስተዳደር",
    feature2Desc: "ለሁሉም የእጩ ሰነዶች የባንክ ደረጃ ማመስጠር ከራስ-ሰር የማለቂያ ማስጠንቀቂያዎች እና ሕጋዊነት መከታተያ ጋር።",
    feature3: "በብዙ ቋንቋ ድጋፍ",
    feature3Desc: "በእንግሊዝኛ እና በአማርኛ ሙሉ የመድረክ ድጋፍ ከእጩ በይነገጾች ለተጨማሪ የቋንቋ አማራጮች ጋር።",
    feature4: "የሞባይል ተደራሽነት",
    feature4Desc: "ዳሽቦርድዎን ይደርሱ እና በሞባይል ተንቀሳቃሽ በይነገጻችን ሥራዎትን ያስተዳድሩ።",
    impact: "የመድረክ ተጽእኖ እና መለኪያዎች",
    impactStories: "ከአጋሮቻችን የሚመጡ የእውነተኛ ስኬት ታሪኮች",
    aided: "የተሰማሩ እጩዎች",
    agency: "አጋር ኤጀንሲዎች",
    employer: "ውጭ ሃገር አሰሪዎች",
    reach: "የተሸፈኑ ሃገራት",
    getInvolved: "ዛሬ ይጀምሩ",
    ctaTitle: "የሪክሩትመንት ኤጀንሲዎን ለመቀየር ዝግጁ ነዎት?",
    ctaSubtitle: "ከ100+ የተሳኩ ኤጀንሲዎች ጋር ይቀላቀሉ",
    startTrial: "ነፃ ሙከራ ይጀምሩ",
    scheduleDemo: "ዴሞ ይመልከቱ",
    benefits: [
      "የሥራ ውጤታማነትን በ70% ይጨምሩ",
      "የሂደት ጊዜን በ60% ይቀንሱ",
      "የእጩ እርካታን በ85% ያሻሽሉ",
      "100% ሕጋዊነትን ያረጋግጡ"
    ]
  }
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
      color: "from-blue-500 to-cyan-400",
      features: ["AI-powered matching", "Complete profile management", "Document tracking"]
    },
    {
      icon: FileCheck,
      title: t.healthCampaigns,
      description: t.healthCampaignsDesc,
      image: "/r2.png",
      color: "from-purple-500 to-pink-500",
      features: ["Automated workflows", "Compliance alerts", "Real-time status"]
    },
    {
      icon: Briefcase,
      title: t.communityDevelopment,
      description: t.communityDevelopmentDesc,
      image: "/r4.jpg",
      color: "from-green-500 to-emerald-400",
      features: ["Order tracking", "Quota management", "Employer portal"]
    },
    {
      icon: Plane,
      title: t.emergencyRelief,
      description: t.emergencyReliefDesc,
      image: "/r3.png",
      color: "from-orange-500 to-yellow-400",
      features: ["Flight management", "Pre-departure checklist", "Deployment tracking"]
    }
  ]

  const advancedFeatures = [
    {
      icon: BarChart,
      title: t.feature1,
      description: t.feature1Desc,
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: Shield,
      title: t.feature2,
      description: t.feature2Desc,
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Globe,
      title: t.feature3,
      description: t.feature3Desc,
      color: "from-green-500 to-emerald-400"
    },
    {
      icon: Zap,
      title: t.feature4,
      description: t.feature4Desc,
      color: "from-orange-500 to-yellow-400"
    }
  ]

  const stats = [
    { icon: TrendingUp, label: t.aided, value: "10,000+", color: "text-blue-600", bg: "bg-blue-100" },
    { icon: Users, label: t.employer, value: "500+", color: "text-purple-600", bg: "bg-purple-100" },
    { icon: Briefcase, label: t.agency, value: "100+", color: "text-green-600", bg: "bg-green-100" },
    { icon: Globe, label: t.reach, value: "25+", color: "text-cyan-600", bg: "bg-cyan-100" }
  ]

  return (
    <main className="w-full bg-gradient-to-b from-blue-50 via-white to-blue-50/30">
      <Header language={language} onLanguageChange={setLanguage} onSignupClick={() => setIsSignupOpen(true)} />

      {/* Hero Section */}
      <div className="pt-32 pb-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">{t.tagline}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {t.title}
            </h1>
            
            <p className="text-xl text-blue-700/80 max-w-3xl mx-auto mb-10">
              {t.subtitle}
            </p>

            {/* Benefits List */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {t.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-blue-200/50">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-blue-800">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Core Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">{t.programs}</h2>
            <p className="text-lg text-blue-700/80 max-w-2xl mx-auto">
              Comprehensive tools designed specifically for Ethiopian recruitment agencies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program, idx) => {
              const Icon = program.icon
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredProgram(idx)}
                  onMouseLeave={() => setHoveredProgram(null)}
                  className="group"
                >
                  <Card className={`overflow-hidden border border-blue-200 h-full transition-all duration-500 ${
                    hoveredProgram === idx ? "shadow-2xl border-blue-300 translate-y-[-8px]" : "hover:shadow-xl"
                  }`}>
                    {/* Image with Gradient Overlay */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={program.image || "/placeholder.svg"}
                        alt={program.title}
                        fill
                        className={`object-cover transition-transform duration-700 ${
                          hoveredProgram === idx ? "scale-110" : "group-hover:scale-105"
                        }`}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-20`} />
                      
                      {/* Icon Overlay */}
                      <div className="absolute top-4 right-4 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                        <Icon className="w-7 h-7 text-blue-600" />
                      </div>
                    </div>

                    <div className="p-8">
                      <h3 className="text-xl font-bold text-blue-900 mb-3">{program.title}</h3>
                      <p className="text-blue-700/80 leading-relaxed mb-6">{program.description}</p>
                      
                      {/* Features List */}
                      <div className="space-y-2 mb-6">
                        {program.features.map((feature, featureIdx) => (
                          <div key={featureIdx} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            <span className="text-sm text-blue-800">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Link href="/features" className="inline-flex items-center gap-2 text-blue-600 font-semibold group/link">
                        <span>Learn more</span>
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50/50 to-cyan-50/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">{t.advancedFeatures}</h2>
            <p className="text-lg text-blue-700/80">Additional capabilities that set TEDBEER apart</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advancedFeatures.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="group">
                  <div className="bg-white rounded-2xl p-6 border border-blue-200 h-full transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-blue-900 mb-3">{feature.title}</h3>
                    <p className="text-blue-700/80 text-sm">{feature.description}</p>
                    
                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300/50 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">{t.impact}</h2>
            <p className="text-lg text-blue-700/80">Real results from agencies using TEDBEER RAMS</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="group">
                  <div className="bg-white rounded-2xl p-8 border border-blue-200 text-center transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                    <div className={`w-16 h-16 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    
                    <div className="text-4xl font-bold text-blue-900 mb-2 group-hover:scale-110 transition-transform origin-center">
                      {stat.value}
                    </div>
                    <p className="text-blue-700/80 font-medium">{stat.label}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Success Stories */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">{t.impactStories}</h3>
            <p className="text-blue-700/80 mb-8 max-w-2xl mx-auto">
              Join hundreds of successful recruitment agencies making a real difference in communities across Ethiopia.
            </p>
            
            <Link href="/login">
              <Button className="group bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-8 py-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <span>View Success Stories</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t.ctaTitle}
          </h2>
          
          <p className="text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto">
            {t.ctaSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup-selection">
              <Button className="group bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <span>{t.startTrial}</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link href="/#demo">
              <Button className="bg-transparent border-2 border-white/30 hover:border-white/50 text-white font-bold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:bg-white/10">
                {t.scheduleDemo}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} language={language} />
      <Footer language={language} />
    </main>
  )
}