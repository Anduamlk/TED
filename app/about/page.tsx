"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SignupModal } from "@/components/signup-modal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, Target, Shield, Zap, Users, Globe, TrendingUp, CheckCircle, ArrowRight, Calendar, Award, Star } from "lucide-react"

type AboutPageProps = {}

const translations = {
  en: {
    title: "About TEDBEER",
    subtitle: "Revolutionizing Recruitment Management Since 2020",
    history: "Our Journey",
    historyContent: "The TEDBEER Recruitment Agency Management System was launched in 2020 to streamline the recruitment process for foreign employment agencies in Ethiopia. We've grown to become the leading digital platform, serving over 100 agencies across the country with cutting-edge technology solutions.",
    mission: "Our Mission & Vision",
    missionTitle: "Digitizing Ethiopian Recruitment Excellence",
    missionContent: "To empower Ethiopian recruitment agencies with intelligent technology solutions that enhance operational efficiency, ensure compliance, and drive transparency throughout the foreign employment lifecycle.",
    visionContent: "To become Africa's premier digital recruitment ecosystem, connecting qualified Ethiopian talent with global opportunities through seamless, secure, and efficient technology.",
    values: "Our Core Values",
    value1: "Innovation - Leveraging cutting-edge technology to solve recruitment challenges",
    value2: "Excellence - Delivering superior quality in every feature and service",
    value3: "Integrity - Maintaining transparency and trust in all operations",
    value4: "Partnership - Growing together with our agency partners",
    team: "Our Leadership",
    teamContent: "Our team combines deep recruitment industry expertise with advanced technical skills to deliver solutions that truly understand and solve agency challenges.",
    stats: {
      agencies: "100+",
      agenciesLabel: "Partner Agencies",
      candidates: "10K+",
      candidatesLabel: "Candidates Managed",
      deployments: "5K+",
      deploymentsLabel: "Successful Deployments",
      satisfaction: "98%",
      satisfactionLabel: "Client Satisfaction"
    },
    achievements: "Our Achievements",
    achievement1: "2022 - Best Recruitment Technology Innovation Award",
    achievement2: "2023 - ISO 27001:2013 Certification for Data Security",
    achievement3: "2024 - Ministry of Labor Recognition for Compliance Excellence",
    cta: "Join Our Growing Network",
    ctaSub: "Start transforming your recruitment operations today",
    getStarted: "Get Started",
    contactSales: "Contact Sales"
  },
  am: {
    title: "ስለ TEDBEER RAMS",
    subtitle: "ከ2020 ጀምሮ የሥራ አሰባሰብ አስተዳደርን እየለወጠ ያለው",
    history: "ጉዞዎቻችን",
    historyContent: "የ TEDBEER ሪክሩትመንት ኤጀንሲ ማኔጅመንት ሲስተም (RAMS) በ2020 ለኢትዮጵያ የውጭ ስራ ኤጀንሲዎች ሂደቱን ለማቃለል ተጀምሯል። በአሁኑ ጊዜ በሀገሪቱ ከ100 በላይ ኤጀንሲዎችን የምናገለግል ዋና ዲጂታል መድረክ ሆነናል።",
    mission: "ተልእኳችን እና ራእይ",
    missionTitle: "የኢትዮጵያ ሪክሩትመንት ሙያ ዲጂታላይዜሽን",
    missionContent: "የኢትዮጵያ ሪክሩትመንት ኤጀንሲዎችን በብልጽግና፣ በህጋዊነት እና በተገለጸነት የሚያሳድጉ ዘመናዊ ቴክኖሎጂ መፍትሄዎች በመስጠት ማብረቅ።",
    visionContent: "በአፍሪካ አቀፍ ደረጃ አስቀድሞ የሚቆም ዲጂታል ሪክሩትመንት ስርዓት መሆን፣ ብቃት ያላቸውን ኢትዮጵያውያን በቀላል፣ ደህንነቱ የተጠበቀ እና ብቃት ያለው ቴክኖሎጂ በመጠቀም ከዓለም አቀፍ እድሎች ጋር በማገናኘት።",
    values: "ዋና ዋና እሴቶቻችን",
    value1: "ልዩነት - ዘመናዊ ቴክኖሎጂን በመጠቀም የሪክሩትመንት ተግዳሮቶችን መፍታት",
    value2: "ሙያዊነት - በእያንዳንዱ አሠራር እና አገልግሎት ከፍተኛ ጥራት ማቅረብ",
    value3: "ንጹህነት - በሁሉም አሰራሮች ተገለጸነትና ተተማምኖ መጠበቅ",
    value4: "አጋርነት - ከኤጀንሲ አጋሮቻችን ጋር አብረን መደጋገም",
    team: "ቡድናችን",
    teamContent: "ቡድናችን የሪክሩትመንት ኢንዱስትሪ ልዩ እውቀትን ከምሩ ቴክኖሎጂ ችሎታ ጋር በማጣመር ኤጀንሲዎች በትክክል የሚገጥማቸውን ችግሮች ለመፍታት የሚረዱ መፍትሄዎችን ያቀርባል።",
    stats: {
      agencies: "100+",
      agenciesLabel: "አጋር ኤጀንሲዎች",
      candidates: "10K+",
      candidatesLabel: "የሚያስተዳድሩ እጩዎች",
      deployments: "5K+",
      deploymentsLabel: "በተሳካ ሁኔታ የተላኩ",
      satisfaction: "98%",
      satisfactionLabel: "የደንበኞች እርካታ"
    },
    achievements: "ስኬቶቻችን",
    achievement1: "2022 - ምርጥ የሪክሩትመንት ቴክኖሎጂ ኢኖቬሽን ሽልማት",
    achievement2: "2023 - የውሂብ ደህንነት ISO 27001:2013 የምስክር ወረቀት",
    achievement3: "2024 - ለህጋዊነት ሙያዊነት የስራ ሚኒስቴር እውቅና",
    cta: "ከሚያድገን ኔትወርክ ጋር ይቀላቀሉ",
    ctaSub: "የሪክሩትመንት ሥራዎትን መለወጥ ዛሬ ይጀምሩ",
    getStarted: "ይጀምሩ",
    contactSales: "ሽያጭ ለማነጋገር"
  },
}

export default function AboutPage() {
  const [language, setLanguage] = useState<string>("en")
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  const t = translations[language as keyof typeof translations] || translations.en

  const values = [
    { icon: Zap, title: t.value1.split(" - ")[0], desc: t.value1.split(" - ")[1], color: "from-blue-500 to-cyan-400" },
    { icon: Target, title: t.value2.split(" - ")[0], desc: t.value2.split(" - ")[1], color: "from-purple-500 to-pink-500" },
    { icon: Shield, title: t.value3.split(" - ")[0], desc: t.value3.split(" - ")[1], color: "from-green-500 to-emerald-400" },
    { icon: Users, title: t.value4.split(" - ")[0], desc: t.value4.split(" - ")[1], color: "from-orange-500 to-yellow-400" },
  ]

  const achievements = [
    { year: "2022", title: t.achievement1, icon: Award },
    { year: "2023", title: t.achievement2, icon: Shield },
    { year: "2024", title: t.achievement3, icon: Star },
  ]

  return (
    <main className="w-full bg-gradient-to-b from-blue-50 via-white to-blue-50/30">
      <Header language={language} onLanguageChange={setLanguage} onSignupClick={() => setIsSignupOpen(true)} />

      {/* Hero Section */}
      <div className="pt-32 pb-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Leading Recruitment Technology Since 2020</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {t.title}
            </h1>
            
            <p className="text-xl text-blue-700/80 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {Object.entries(t.stats).map(([key, value], index) => (
              <div key={key} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-lg">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {typeof value === 'string' ? value : value}
                </div>
                <div className="text-blue-700/80 font-medium mt-2">
                  {typeof value === 'object' ? t.stats[key as keyof typeof t.stats].label : t.stats[key as keyof typeof t.stats].label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-blue-600 font-semibold">
                <div className="w-8 h-0.5 bg-blue-500"></div>
                {t.history}
              </div>
              <h2 className="text-4xl font-bold text-blue-900">Our Journey of Innovation</h2>
              <p className="text-lg text-blue-700/80 leading-relaxed">
                {t.historyContent}
              </p>
              
              <div className="flex items-center gap-4 pt-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-900">4+ Years</div>
                  <div className="text-blue-600">Of Digital Transformation</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-200">
                <Image
                  src="/im5.png"
                  alt="TEDBEER Journey"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl border border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-blue-600">Growth Rate</div>
                    <div className="text-2xl font-bold text-blue-900">200% YoY</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-r from-blue-50/50 to-cyan-50/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">{t.mission}</h2>
            <p className="text-xl text-blue-700/80 max-w-3xl mx-auto">{t.missionTitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-200">
              <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Mission</h3>
              <p className="text-blue-700/80 leading-relaxed">
                {t.missionContent}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-8 shadow-xl text-white">
              <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="leading-relaxed opacity-95">
                {t.visionContent}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">{t.values}</h2>
            <p className="text-lg text-blue-700/80">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="group relative bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">{value.title}</h3>
                <p className="text-blue-700/80 text-sm">{value.desc}</p>
                
                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300/50 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gradient-to-b from-blue-50/30 to-transparent">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">{t.achievements}</h2>
            <p className="text-lg text-blue-700/80">Recognition for our commitment to excellence</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="relative group">
                <div className="bg-white rounded-2xl p-8 border border-blue-200 shadow-lg hover:shadow-2xl transition-all duration-500">
                  <div className="absolute -top-4 left-8">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-bold">
                      {achievement.year}
                    </div>
                  </div>
                  
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6 mt-4">
                    <achievement.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-blue-900 leading-relaxed">
                    {achievement.title}
                  </h3>
                </div>
                
                {/* Connecting line */}
                {index < achievements.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-transparent group-hover:from-blue-400 transition-colors duration-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-200">
                <Image
                  src="/im4.png"
                  alt="TEDBEER Team"
                  width={600}
                  height={450}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -bottom-4 -right-4 bg-white p-6 rounded-2xl shadow-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-900">Expert Team</div>
                    <div className="text-sm text-blue-600">15+ Specialists</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-blue-600 font-semibold">
                <div className="w-8 h-0.5 bg-blue-500"></div>
                {t.team}
              </div>
              <h2 className="text-4xl font-bold text-blue-900">Meet Our Expert Team</h2>
              <p className="text-lg text-blue-700/80 leading-relaxed">
                {t.teamContent}
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-blue-900">Recruitment Industry Experts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  <span className="text-blue-900">Software Architects</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-blue-900">Compliance Specialists</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  <span className="text-blue-900">Customer Success Team</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t.cta}
          </h2>
          
          <p className="text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto">
            {t.ctaSub}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup-selection">
              <Button className="group bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <span>{t.getStarted}</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link href="/contact">
              <Button className="bg-transparent border-2 border-white/30 hover:border-white/50 text-white font-bold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:bg-white/10">
                {t.contactSales}
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-blue-200">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">30-day</div>
              <div className="text-blue-200">Free Trial</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">Onboarding</div>
              <div className="text-blue-200">Assistance</div>
            </div>
          </div>
        </div>
      </section>

      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} language={language} />
      <Footer language={language} />
    </main>
  )
}