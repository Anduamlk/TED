"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { 
  Mail, Phone, MapPin, Send, MessageSquare, 
  Clock, CheckCircle, ArrowRight, 
  Globe, Users, Shield, Zap
} from "lucide-react"
import { FaWhatsapp, FaLinkedin, FaTwitter, FaYoutube, FaFacebook } from "react-icons/fa"

const translations = {
  en: {
    title: "Get in Touch",
    subtitle: "We're here to help you succeed",
    description: "Whether you have a question, need support, or want to explore our services, we're here to help! Our dedicated team is always ready to assist you with personalized solutions and expert guidance.",
    contactTitle: "Contact Information",
    quickSupport: "Quick Support",
    addressTitle: "Our Office",
    address: "Addis Ababa, Ethiopia",
    emailTitle: "Email Us",
    email: "support@tedbeer.com",
    phoneTitle: "Call Us",
    phone: "+251 911 923 322",
    workingHours: "Working Hours",
    hours: "Mon - Fri: 8:00 AM - 6:00 PM",
    formTitle: "Send us a message",
    name: "Your Full Name",
    emailField: "Email Address",
    phoneField: "Phone Number",
    subject: "Subject",
    message: "Your Message",
    sendMessage: "Send Message",
    responseTime: "We typically respond within 2 hours during business days",
    supportChannels: "Support Channels",
    whatsapp: "Chat on WhatsApp",
    linkedin: "Connect on LinkedIn",
    twitter: "Follow on Twitter",
    youtube: "Watch on YouTube",
    facebook: "Join on Facebook",
    emergency: "24/7 Emergency Support",
    technical: "Technical Support",
    sales: "Sales Inquiry",
    partnership: "Partnership",
    faq: "Visit FAQ",
    success: "Message sent successfully!",
    ctaTitle: "Ready to Transform Your Recruitment?",
    ctaSubtitle: "Join 100+ agencies using TEDBEER RAMS",
    startTrial: "Start Free Trial",
    scheduleDemo: "Schedule Demo",
    trustFactors: [
      "24/7 Customer Support",
      "98% Response Rate",
      "Multilingual Support"
    ]
  },
  am: {
    title: "አግኙን",
    subtitle: "ለእርስዎ እርዳታ እዚህ አለን",
    description: "ጥያቄ ካለዎት፣ ድጋፍ ከፈለጉ ወይም አገልግሎቶቻችንን ለማወቅ ከፈለጉ፣ እርስዎን ለመርዳት እዚህ አለን! የተለየ የተሰራ ቡድናችን ሁልጊዜ ለመርዳት ዝግጁ ነው።",
    contactTitle: "የመገናኛ መረጃ",
    quickSupport: "ፈጣን ድጋፍ",
    addressTitle: "ቢሮቻችን",
    address: "አዲስ አበባ፣ ኢትዮጵያ",
    emailTitle: "ኢሜይል",
    email: "support@tedbeer.com",
    phoneTitle: "ስልክ",
    phone: "+251 911 923 322",
    workingHours: "የስራ ሰዓት",
    hours: "ሰኞ - አርብ፡ 8፡00 ጥዋት - 6፡00 ማታ",
    formTitle: "መልእክት ይጻፉልን",
    name: "ሙሉ ስምዎ",
    emailField: "ኢሜይል አድራሻ",
    phoneField: "ስልክ ቁጥር",
    subject: "ርዕስ",
    message: "መልእክትዎ",
    sendMessage: "መልእክት ይላኩ",
    responseTime: "በስራ ቀናት በተለምዶ በ2 ሰዓት ውስጥ እንመልሳለን",
    supportChannels: "የድጋፍ መንገዶች",
    whatsapp: "በWhatsApp ይተወያዩ",
    linkedin: "በLinkedIn ይገናኙ",
    twitter: "በTwitter ይከተሉን",
    youtube: "በYouTube ይመልከቱን",
    facebook: "በFacebook ይቀላቀሉን",
    emergency: "24/7 አደጋ ድጋፍ",
    technical: "ቴክኒካል ድጋፍ",
    sales: "የሽያጭ ጥያቄ",
    partnership: "አጋርነት",
    faq: "ጥያቄዎች ይመልከቱ",
    success: "መልእክትዎ በተሳካ ሁኔታ ተልኳል!",
    ctaTitle: "ሪክሩትመንትዎን ለመቀየር ዝግጁ ነዎት?",
    ctaSubtitle: "ከ100+ ኤጀንሲዎች ጋር ይቀላቀሉ",
    startTrial: "ነፃ ሙከራ ይጀምሩ",
    scheduleDemo: "ዴሞ ያቅዱ",
    trustFactors: [
      "24/7 የደንበኛ ድጋፍ",
      "98% የመልስ መጠን",
      "በብዙ ቋንቋ ድጋፍ"
    ]
  }
}

export default function ContactPage() {
  const [language, setLanguage] = useState<string>("en")
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })

  const t = translations[language as keyof typeof translations] || translations.en

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const socialLinks = [
    { icon: FaWhatsapp, label: t.whatsapp, href: "#", color: "bg-green-500" },
    { icon: FaLinkedin, label: t.linkedin, href: "#", color: "bg-blue-600" },
    { icon: FaTwitter, label: t.twitter, href: "#", color: "bg-sky-500" },
    { icon: FaYoutube, label: t.youtube, href: "#", color: "bg-red-600" },
    { icon: FaFacebook, label: t.facebook, href: "#", color: "bg-blue-700" },
  ]

  const supportCategories = [
    { icon: Shield, label: t.emergency, href: "#", color: "from-red-500 to-orange-500" },
    { icon: Zap, label: t.technical, href: "#", color: "from-blue-500 to-cyan-500" },
    { icon: Users, label: t.sales, href: "#", color: "from-green-500 to-emerald-500" },
    { icon: Globe, label: t.partnership, href: "#", color: "from-purple-500 to-pink-500" },
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
              <span className="text-sm font-semibold">{t.quickSupport}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {t.title}
            </h1>
            
            <p className="text-xl text-blue-700/80 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* Trust Factors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
            {t.trustFactors.map((factor, index) => (
              <div key={index} className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50 shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-blue-800 font-medium">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Contact Section */}
      <section className="py-10 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Contact Info & Support */}
            <div className="space-y-12">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-8 border border-blue-200 shadow-lg">
                <h2 className="text-2xl font-bold text-blue-900 mb-8">{t.contactTitle}</h2>
                
                <div className="space-y-8">
                  {/* Address */}
                  <div className="flex items-start gap-4 group cursor-pointer hover:translate-x-2 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">{t.addressTitle}</h3>
                      <p className="text-blue-700/80 mt-1">{t.address}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4 group cursor-pointer hover:translate-x-2 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">{t.emailTitle}</h3>
                      <a href="mailto:support@tedbeer.com" className="text-blue-600 hover:text-blue-800 transition-colors mt-1 block">
                        {t.email}
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4 group cursor-pointer hover:translate-x-2 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">{t.phoneTitle}</h3>
                      <a href="tel:+251911923322" className="text-blue-600 hover:text-blue-800 transition-colors mt-1 block">
                        {t.phone}
                      </a>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-4 group cursor-pointer hover:translate-x-2 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">{t.workingHours}</h3>
                      <p className="text-blue-700/80 mt-1">{t.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Channels */}
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-8 text-white shadow-xl">
                <h2 className="text-2xl font-bold mb-6">{t.supportChannels}</h2>
                
                <div className="space-y-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 group"
                    >
                      <div className={`${social.color} w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <social.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium">{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-white rounded-2xl border border-blue-200 shadow-2xl p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-2">{t.formTitle}</h2>
                <p className="text-blue-700/80 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {t.responseTime}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.name}
                      required
                      className="w-full rounded-xl border border-blue-200 bg-blue-50/50 px-5 py-4 text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t.emailField}
                      required
                      className="w-full rounded-xl border border-blue-200 bg-blue-50/50 px-5 py-4 text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Phone & Subject */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t.phoneField}
                      required
                      className="w-full rounded-xl border border-blue-200 bg-blue-50/50 px-5 py-4 text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t.subject}
                      required
                      className="w-full rounded-xl border border-blue-200 bg-blue-50/50 px-5 py-4 text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder={t.message}
                    required
                    className="w-full rounded-xl border border-blue-200 bg-blue-50/50 px-5 py-4 text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="group relative w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <span>{t.sendMessage}</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  
                  {/* Success Message */}
                  {isSubmitted && (
                    <div className="absolute inset-0 bg-green-500 rounded-xl flex items-center justify-center gap-2 animate-fade-in">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">{t.success}</span>
                    </div>
                  )}
                </button>
              </form>

              {/* Support Categories */}
              <div className="mt-12 pt-8 border-t border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-6">Quick Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  {supportCategories.map((category, index) => (
                    <a
                      key={index}
                      href={category.href}
                      className="group bg-gradient-to-br from-white to-blue-50 rounded-xl p-4 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-blue-900">{category.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden">
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
            <a href="/signup-selection">
              <Button className="group bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <span>{t.startTrial}</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            
            <a href="/contact">
              <Button className="bg-transparent border-2 border-white/30 hover:border-white/50 text-white font-bold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:bg-white/10">
                {t.scheduleDemo}
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer language={language} />

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </main>
  )
}