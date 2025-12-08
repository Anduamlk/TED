"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SelectionCard } from "@/components/selection-card"
import { User, Briefcase, Building2, ArrowLeft, CheckCircle, Globe, Shield, Zap } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const translations = {
  en: {
    title: "Join TEDBEER Platform",
    subtitle: "Choose your account type to begin your journey",
    tagline: "Select the perfect path for your recruitment needs",
    candidateTitle: "For Job Seekers",
    candidateDesc: "Access international job opportunities, manage your profile, and track your placement journey with our comprehensive candidate portal.",
    candidateBtn: "Register as Candidate",
    candidateFeatures: [
      "Personalized job matching",
      "Visa status tracking",
      "Document management",
      "24/7 support access"
    ],
    employerTitle: "For Overseas Employers",
    employerDesc: "Find qualified Ethiopian talent, manage job orders efficiently, and streamline your international hiring process.",
    employerBtn: "Register as Employer",
    employerFeatures: [
      "Candidate database access",
      "Job order management",
      "Compliance tracking",
      "Progress tracking",
      "Dedicated support"
    ],
    agencyTitle: "For Recruitment Agencies",
    agencyDesc: "Manage end-to-end recruitment operations with our comprehensive agency management system designed specifically for Ethiopian agencies.",
    agencyBtn: "Register as Agency",
    agencyFeatures: [
      "Full lifecycle management",
      "Compliance tracking",
      "Analytics dashboard"
    ],
    benefitsTitle: "Why Register with TEDBEER?",
    benefit1: "Secure Platform",
    benefit1Desc: "Bank-level security with data protection compliant with Ethiopian regulations",
    benefit2: "Fast Processing",
    benefit2Desc: "Automated workflows that reduce processing time by up to 60%",
    benefit3: "Global Network",
    benefit3Desc: "Connect with employers and candidates across 25+ destination countries",
    benefit4: "24/7 Support",
    benefit4Desc: "Multi-language support team available round the clock",
    statsTitle: "Trusted by Thousands",
    candidates: "10,000+ Candidates",
    agencies: "100+ Agencies",
    employers: "500+ Employers",
    successRate: "95% Success Rate",
    backHome: "Back to Home",
    ctaTitle: "Ready to Get Started?",
    ctaSubtitle: "Join our community of successful recruiters and candidates",
    needHelp: "Need help choosing?",
    contactUs: "Contact our team"
  },
  am: {
    title: "በ TEDBEER መድረክ ይቀላቀሉ",
    subtitle: "ጉዞዎን ለመጀመር የመለያ አይነትዎን ይምረጡ",
    tagline: "ለቅጥር ፍላጎቶችዎ ፍጹም መንገድ ይምረጡ",
    candidateTitle: "ለስራ ፈላጊዎች",
    candidateDesc: "ዓለም አቀፍ የስራ እድሎችን ይድረሱ፣ መገለጫዎን ያቀናብሩ እና አጠቃላይ የምደባ ጉዞዎን በተዘጋጀው የእጩ ፖርታላችን ይከታተሉ።",
    candidateBtn: "እንደ እጩ ይመዝገቡ",
    candidateFeatures: [
      "የተገላቢጦሽ የስራ መመሳሰል",
      "የቪዛ ሁኔታ እይታ",
      "የሰነድ አስተዳደር",
      "24/7 የድጋፍ መዳረሻ"
    ],
    employerTitle: "ለውጭ ሃገር አሰሪዎች",
    employerDesc: "ብቃት ያላቸውን ኢትዮጵያውያን ብሄረሰብ ያግኙ፣ የስራ ትዕዛዞችን በብቃት ያቀናብሩ እና የዓለም አቀፍ የቅጥር ሂደትዎን ያቀናብሩ።",
    employerBtn: "እንደ አሰሪ ይመዝገቡ",
    employerFeatures: [
      "የእጩ ዳታቤዝ መዳረሻ",
      "የስራ ትዕዛዝ አስተዳደር",
      "የእድገት እይታ",
      "የተለየ ድጋፍ"
    ],
    agencyTitle: "ለሪክሩትመንት ኤጀንሲዎች",
    agencyDesc: "አጠቃላይ የሪክሩትመንት ሥራዎችን በተለይ ለኢትዮጵያውያን ኤጀንሲዎች የተነደፈ አጠቃላይ የኤጀንሲ አስተዳደር ስርዓታችን ያቀናብሩ።",
    agencyBtn: "እንደ ኤጀንሲ ይመዝገቡ",
    agencyFeatures: [
      "ሙሉ የሕይወት ዑደት አስተዳደር",
      "የሕጋዊነት እይታ",
      "የጉዞ ምቾት",
      "የትንታኔ ዳሽቦርድ"
    ],
    benefitsTitle: "ለምን በ TEDBEER ይመዝገቡ?",
    benefit1: "ደህንነቱ የተጠበቀ መድረክ",
    benefit1Desc: "የባንክ ደረጃ ደህንነት ከኢትዮጵያ ደንቦች ጋር የሚጣጣም የውሂብ ጥበቃ",
    benefit2: "ፈጣን ማሰራት",
    benefit2Desc: "የሂደት ጊዜን እስከ 60% የሚቀንሱ ራስ-ሰር የሥራ ፍሰቶች",
    benefit3: "ዓለም አቀፍ አውታረመረብ",
    benefit3Desc: "በ25+ የመድረሻ ሃገራት ከአሰሪዎች እና ከእጩዎች ጋር ይገናኙ",
    benefit4: "24/7 ድጋፍ",
    benefit4Desc: "በብዙ ቋንቋ የድጋፍ ቡድን ሙሉ ሰዓት ይገኛል",
    statsTitle: "በሺዎች የሚቆጠሩ የታመኑ",
    candidates: "10,000+ እጩዎች",
    agencies: "100+ ኤጀንሲዎች",
    employers: "500+ አሰሪዎች",
    successRate: "95% የስኬት መጠን",
    backHome: "ወደ ቤት ተመለስ",
    ctaTitle: "መጀመር ዝግጁ ነዎት?",
    ctaSubtitle: "ከተሳኩ ሪክሩተሮች እና እጩዎች ማህበረሰባችን ጋር ይቀላቀሉ",
    needHelp: "ለመምረጥ እርዳታ ያስፈልግዎታል?",
    contactUs: "ቡድናችንን ያግኙ"
  }
}

export default function SignupSelectionPage() {
  const router = useRouter()
  const [language, setLanguage] = useState("en")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const t = translations[language as keyof typeof translations] || translations.en

  const selectionTypes = [
    {
      icon: User,
      title: t.candidateTitle,
      description: t.candidateDesc,
      buttonText: t.candidateBtn,
      route: "/register/candidate",
      features: t.candidateFeatures,
      color: "from-blue-500 to-cyan-400",
      accentColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Briefcase,
      title: t.employerTitle,
      description: t.employerDesc,
      buttonText: t.employerBtn,
      route: "/register/employer",
      features: t.employerFeatures,
      color: "from-purple-500 to-pink-500",
      accentColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Building2,
      title: t.agencyTitle,
      description: t.agencyDesc,
      buttonText: t.agencyBtn,
      route: "/register/agency",
      features: t.agencyFeatures,
      color: "from-green-500 to-emerald-400",
      accentColor: "bg-green-100",
      iconColor: "text-green-600"
    }
  ]

  const benefits = [
    {
      icon: Shield,
      title: t.benefit1,
      description: t.benefit1Desc,
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: Zap,
      title: t.benefit2,
      description: t.benefit2Desc,
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Globe,
      title: t.benefit3,
      description: t.benefit3Desc,
      color: "from-green-500 to-emerald-400"
    },
    {
      icon: User,
      title: t.benefit4,
      description: t.benefit4Desc,
      color: "from-orange-500 to-yellow-400"
    }
  ]

  const stats = [
    { value: t.candidates, color: "text-blue-600", bg: "bg-blue-100" },
    { value: t.agencies, color: "text-purple-600", bg: "bg-purple-100" },
    { value: t.employers, color: "text-green-600", bg: "bg-green-100" },
    { value: t.successRate, color: "text-cyan-600", bg: "bg-cyan-100" }
  ]

  return (
    <main className="w-full bg-gradient-to-b from-blue-50 via-white to-blue-50/30">
      <Header language={language} onLanguageChange={setLanguage} onSignupClick={() => {}} />

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
            
            <p className="text-xl text-blue-700/80 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Selection Cards */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {selectionTypes.map((type, idx) => {
              const Icon = type.icon
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group"
                >
                  <div className={`bg-white rounded-2xl border border-blue-200 h-full transition-all duration-500 ${
                    hoveredCard === idx ? "shadow-2xl border-blue-300 translate-y-[-8px]" : "hover:shadow-xl"
                  }`}>
                    {/* Gradient Header */}
                    <div className={`h-2 bg-gradient-to-r ${type.color}`}></div>
                    
                    <div className="p-8">
                      {/* Icon Section */}
                      <div className={`w-16 h-16 ${type.accentColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-8 h-8 ${type.iconColor}`} />
                      </div>
                      
                      {/* Title & Description */}
                      <h2 className="text-2xl font-bold text-blue-900 mb-4">{type.title}</h2>
                      <p className="text-blue-700/80 mb-6 leading-relaxed">{type.description}</p>
                      
                      {/* Features List */}
                      <div className="space-y-3 mb-8">
                        {type.features.map((feature, featureIdx) => (
                          <div key={featureIdx} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="w-3 h-3 text-blue-500" />
                            </div>
                            <span className="text-sm text-blue-800">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* CTA Button */}
                      <button
                        onClick={() => router.push(type.route)}
                        className={`group/btn w-full bg-gradient-to-r ${type.color} hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center`}
                      >
                        <span>{type.buttonText}</span>
                        <svg 
                          className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Stats Section */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-blue-900 text-center mb-8">{t.statsTitle}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-blue-200 text-center">
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className={`h-2 rounded-full ${stat.bg}`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-blue-900 text-center mb-8">{t.benefitsTitle}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon
                return (
                  <div key={idx} className="group">
                    <div className="bg-white rounded-2xl p-6 border border-blue-200 h-full transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <h4 className="text-lg font-bold text-blue-900 mb-3">{benefit.title}</h4>
                      <p className="text-blue-700/80 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <h3 className="text-3xl font-bold text-blue-900 mb-4">{t.ctaTitle}</h3>
            <p className="text-lg text-blue-700/80 mb-8 max-w-2xl mx-auto">
              {t.ctaSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/contact" 
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors flex items-center gap-2"
              >
                {t.needHelp}
                <span className="text-blue-500">{t.contactUs}</span>
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-16">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t.backHome}
            </Link>
          </div>
        </div>
      </section>

      <Footer language={language} />
    </main>
  )
}