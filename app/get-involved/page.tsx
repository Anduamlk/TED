"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SignupModal } from "@/components/signup-modal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  User, Briefcase, Building2, CheckCircle, 
  Globe, Shield, Zap, ArrowRight,
  Target, Users, Plane, FileText,
  BarChart, Clock, Award, TrendingUp
} from "lucide-react"
import Link from "next/link"

const translations = {
  en: {
    title: "Join TEDBEER Platform",
    subtitle: "Choose Your Path in the Global Recruitment Ecosystem",
    tagline: "All the Tools You Need in One Platform",
    candidateTitle: "For Job Seekers",
    candidateDesc: "Access international job opportunities, manage your profile, and track your entire placement journey with our comprehensive candidate portal.",
    candidateFeatures: [
      "Create detailed professional profiles",
      "Track visa & application status",
      "Upload and manage documents",
      "Receive matched job alerts",
      "24/7 support during placement"
    ],
    candidateCTA: "Register as Candidate",
    employerTitle: "For Overseas Employers",
    employerDesc: "Find qualified Ethiopian talent, manage job orders efficiently, and streamline your international hiring process with our employer dashboard.",
    employerFeatures: [
      "Post and manage job orders",
      "Access pre-screened candidates",
      "Track fulfillment progress",
      "Analytics and reporting tools",
      "Dedicated account manager"
    ],
    employerCTA: "Register as Employer",
    agencyTitle: "For Recruitment Agencies",
    agencyDesc: "Manage end-to-end recruitment operations with our comprehensive agency management system designed specifically for Ethiopian agencies.",
    agencyFeatures: [
      "Full candidate lifecycle management",
      "Visa and compliance tracking",
      "Travel logistics coordination",
      "Multi-country placement support",
    ],
    agencyCTA: "Register as Agency",
    whyTitle: "Why Choose TEDBEER?",
    whyDesc: "Built specifically for the Ethiopian recruitment ecosystem",
    security: "Bank-Level Security",
    securityDesc: "Enterprise-grade encryption and compliance with Ethiopian data protection regulations",
    efficient: "70% Faster Processing",
    efficientDesc: "Automated workflows reduce manual work and speed up candidate placement",
    support: "24/7 Dedicated Support",
    supportDesc: "Multi-language support team available round the clock for all users",
    global: "Global Network",
    globalDesc: "Connect with employers and agencies across 25+ destination countries",
    statsTitle: "Join Our Growing Community",
    candidates: "10K+ Candidates",
    agencies: "100+ Agencies",
    employers: "500+ Employers",
    countries: "25+ Countries",
    benefitsTitle: "Platform Benefits",
    benefit1: "Seamless Integration",
    benefit1Desc: "Connect with existing systems and workflows effortlessly",
    benefit2: "Mobile First",
    benefit2Desc: "Access all features on mobile devices with native performance",
    benefit3: "Regular Updates",
    benefit3Desc: "Continuous improvements and new features based on user feedback",
    benefit4: "Training & Onboarding",
    benefit4Desc: "Comprehensive training materials and onboarding support",
    ctaTitle: "Ready to Get Started?",
    ctaSubtitle: "Join thousands who have transformed their recruitment journey",
    startNow: "Register Now",
    scheduleDemo: "Schedule a Demo"
  },
  am: {
    title: "በ TEDBEER መድረክ ይቀላቀሉ",
    subtitle: "በዓለም አቀፍ ሪክሩትመንት ስርዓት ውስጥ መንገድዎን ይምረጡ",
    tagline: "ሁሉንም የሚያስፈልጉዎት መሳሪያዎች በአንድ መድረክ",
    candidateTitle: "ለስራ ፈላጊዎች",
    candidateDesc: "ዓለም አቀፍ የስራ እድሎችን ይድረሱ፣ መገለጫዎን ያቀናብሩ እና አጠቃላይ የምደባ ጉዞዎን በተዘጋጀው የእጩ ፖርታላችን ይከታተሉ።",
    candidateFeatures: [
      "ዝርዝር የሙያ መገለጫዎችን ይፍጠሩ",
      "የቪዛ እና የመኖሪያ ማመልከቻ ሁኔታን ይከታተሉ",
      "ሰነዶችን ይጭኑ እና ያቀናብሩ",
      "የተመጣጠነ የስራ ማሳወቂያዎችን ይቀበሉ",
      "በምደባ ጊዜ 24/7 ድጋፍ"
    ],
    candidateCTA: "እንደ እጩ ይመዝገቡ",
    employerTitle: "ለውጭ ሃገር አሰሪዎች",
    employerDesc: "ብቃት ያላቸውን ኢትዮጵያውያን ብሄረሰብ ያግኙ፣ የስራ ትዕዛዞችን በብቃት ያቀናብሩ እና የዓለም አቀፍ የቅጥር ሂደትዎን በአሰሪ ዳሽቦርዳችን ያቀናብሩ።",
    employerFeatures: [
      "የስራ ትዕዛዞችን ለጥፍ እና አስተዳድር",
      "በቅድሚያ የተመረመሩ እጩዎችን ይድረሱ",
      "የማሟላት እድገትን ይከታተሉ",
      "የትንታኔ እና የሪፖርት መሣሪያዎች",
      "የተለየ የመለያ አስተዳዳሪ"
    ],
    employerCTA: "እንደ አሰሪ ይመዝገቡ",
    agencyTitle: "ለሪክሩትመንት ኤጀንሲዎች",
    agencyDesc: "አጠቃላይ የሪክሩትመንት ሥራዎችን በተለይ ለኢትዮጵያውያን ኤጀንሲዎች የተነደፈ አጠቃላይ የኤጀንሲ አስተዳደር ስርዓታችን ያቀናብሩ።",
    agencyFeatures: [
      "ሙሉ የእጩ የህይወት ዑደት አስተዳደር",
      "የቪዛ እና የሕጋዊነት እይታ",
      "የጉዞ ምቾት ማመቻቸት",
      "በብዙ ሃገር የምደባ ድጋፍ",
      "ቅጽበታዊ የትንታኔ ዳሽቦርድ"
    ],
    agencyCTA: "እንደ ኤጀንሲ ይመዝገቡ",
    whyTitle: "ለምን TEDBEER ይምረጡ?",
    whyDesc: "በተለይ ለኢትዮጵያውያን ሪክሩትመንት ስርዓት የተገነባ",
    security: "የባንክ ደረጃ ደህንነት",
    securityDesc: "የድርጅት ደረጃ ማመስጠር እና ከኢትዮጵያ የውሂብ ጥበቃ ደንቦች ጋር መገጣጠም",
    efficient: "70% በፍጥነት ማሰራት",
    efficientDesc: "ራስ-ሰር የሥራ ፍሰቶች የጅምላ ሥራን ይቀንሳሉ እና የእጩ ምደባን ያቃልላሉ",
    support: "24/7 የተለየ ድጋፍ",
    supportDesc: "በብዙ ቋንቋ የድጋፍ ቡድን ለሁሉም ተጠቃሚዎች ሙሉ ሰዓት ይገኛል",
    global: "ዓለም አቀፍ አውታረመረብ",
    globalDesc: "በ25+ የመድረሻ ሃገራት ከአሰሪዎች እና ከኤጀንሲዎች ጋር ይገናኙ",
    statsTitle: "ከሚያድገን ማህበረሰብ ጋር ይቀላቀሉ",
    candidates: "10K+ እጩዎች",
    agencies: "100+ ኤጀንሲዎች",
    employers: "500+ አሰሪዎች",
    countries: "25+ ሃገራት",
    benefitsTitle: "የመድረክ ጥቅሞች",
    benefit1: "ስላሳ ውህደት",
    benefit1Desc: "ከነባር ስርዓቶች እና የስራ ፍሰቶች ጋር በቀላሉ ይገናኙ",
    benefit2: "ሞባይል ፈርስት",
    benefit2Desc: "በሞባይል መሣሪያዎች ሁሉንም ባህሪያት በውስጣዊ አፈፃፀም ይድረሱ",
    benefit3: "የመደበኛ ማዘመኛዎች",
    benefit3Desc: "በተጠቃሚ አስተያየት ላይ የተመሰረተ ቀጣይነት ያለው ማሻሻያ እና አዳዲስ ባህሪያት",
    benefit4: "ስልጠና እና መውጫ",
    benefit4Desc: "ሙሉ የስልጠና ቁሳቁሶች እና የመውጫ ድጋፍ",
    ctaTitle: "መጀመር ዝግጁ ነዎት?",
    ctaSubtitle: "የቅጥር ጉዞያቸውን ከቀየሩ በሺዎች የሚቆጠሩ ሰዎች ጋር ይቀላቀሉ",
    startNow: "አሁን ይመዝገቡ",
    scheduleDemo: "ዴሞ ያቅዱ"
  }
}

export default function GetInvolvedPage() {
  const [language, setLanguage] = useState<string>("en")
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const t = translations[language as keyof typeof translations] || translations.en

  const registrationTypes = [
    {
      icon: User,
      title: t.candidateTitle,
      description: t.candidateDesc,
      features: t.candidateFeatures,
      cta: t.candidateCTA,
      route: "/register/candidate",
      color: "from-blue-500 to-cyan-400",
      accentColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Briefcase,
      title: t.employerTitle,
      description: t.employerDesc,
      features: t.employerFeatures,
      cta: t.employerCTA,
      route: "/register/employer",
      color: "from-purple-500 to-pink-500",
      accentColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Building2,
      title: t.agencyTitle,
      description: t.agencyDesc,
      features: t.agencyFeatures,
      cta: t.agencyCTA,
      route: "/register/agency",
      color: "from-green-500 to-emerald-400",
      accentColor: "bg-green-100",
      iconColor: "text-green-600"
    }
  ]

  const whyChoose = [
    {
      icon: Shield,
      title: t.security,
      description: t.securityDesc,
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: Zap,
      title: t.efficient,
      description: t.efficientDesc,
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      title: t.support,
      description: t.supportDesc,
      color: "from-green-500 to-emerald-400"
    },
    {
      icon: Globe,
      title: t.global,
      description: t.globalDesc,
      color: "from-orange-500 to-yellow-400"
    }
  ]

  const stats = [
    { value: t.candidates, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { value: t.agencies, icon: Building2, color: "text-purple-600", bg: "bg-purple-100" },
    { value: t.employers, icon: Briefcase, color: "text-green-600", bg: "bg-green-100" },
    { value: t.countries, icon: Globe, color: "text-cyan-600", bg: "bg-cyan-100" }
  ]

  const benefits = [
    {
      icon: Target,
      title: t.benefit1,
      description: t.benefit1Desc
    },
    {
      icon: Zap,
      title: t.benefit2,
      description: t.benefit2Desc
    },
    {
      icon: TrendingUp,
      title: t.benefit3,
      description: t.benefit3Desc
    },
    {
      icon: Award,
      title: t.benefit4,
      description: t.benefit4Desc
    }
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
            
            <p className="text-xl text-blue-700/80 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Registration Cards Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {registrationTypes.map((type, idx) => {
              const Icon = type.icon
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group"
                >
                  <Card className={`overflow-hidden border border-blue-200 h-full transition-all duration-500 ${
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
                      <Link href={type.route}>
                        <Button className={`group/btn w-full bg-gradient-to-r ${type.color} hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-lg`}>
                          <span>{type.cta}</span>
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50/50 to-cyan-50/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">{t.statsTitle}</h2>
            <p className="text-lg text-blue-700/80">Become part of our growing ecosystem</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="group">
                  <div className="bg-white rounded-2xl p-8 border border-blue-200 text-center transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                    <div className={`w-16 h-16 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <div className="text-3xl font-bold text-blue-900">{stat.value}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">{t.whyTitle}</h2>
            <p className="text-lg text-blue-700/80 max-w-2xl mx-auto">{t.whyDesc}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChoose.map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="group">
                  <div className="bg-white rounded-2xl p-8 border border-blue-200 h-full transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-blue-900 mb-3">{item.title}</h3>
                    <p className="text-blue-700/80 text-sm">{item.description}</p>
                    
                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300/50 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50/50 to-cyan-50/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">{t.benefitsTitle}</h2>
            <p className="text-lg text-blue-700/80">Additional advantages of using TEDBEER RAMS</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <div key={idx} className="flex items-start gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 hover:border-blue-300 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-900 mb-2">{benefit.title}</h3>
                    <p className="text-blue-700/80">{benefit.description}</p>
                  </div>
                </div>
              )
            })}
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
                <span>{t.startNow}</span>
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