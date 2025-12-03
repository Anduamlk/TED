"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SignupModal } from "@/components/signup-modal"
import { Card } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
interface Translation {
  title: string;
  faq: string;
  contact: string;
  q1: string;
  a1: string;
  q2: string;
  a2: string;
  q3: string;
  a3: string;
  q4: string;
  a4: string;
  q5: string;
  a5: string;
  q6: string;
  a6: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
  emailAddr: string;
  phoneNum: string;
  officeAddr: string;
  officeHours: string;
  sendMessage: string;
  name: string;
  message: string;
  send: string;
}

const translations: { [key: string]: Translation } = {
  en: {
    title: "Help & Support",
    faq: "Frequently Asked Questions",
    contact: "Contact Us",
    q1: "How do I register as a candidate for overseas employment?",
    a1: "You can register through our platform by filling out your personal details, uploading required documents (passport, medical, police clearance), and selecting your preferred destination country. Our system will guide you through the entire process from registration to deployment.",
    q2: "How do I know if my documents have been approved?",
     a2: "The system tracks your documents and their approval status. You'll receive email and SMS notifications when any of your documents (such as passport or medical clearance) are approved or require further action.",
    q3: "How can I track my visa and job order status?",
     a3: "Our system provides a real-time visa tracking feature. You will be able to see the progress of your visa application, including the status (e.g., 'Submitted', 'Approved', 'Rejected'). The job order management section also lets you track which employer has selected your profile.",
    q4: "Can I update my registration information after submission?",
    a4: "Yes, you can update your personal information and documents anytime through your profile page. However, certain fields may require administrative approval before changes take effect.",
    q5: "How can I contact support if I face any issues?",
    a5: "If you need help, you can contact us via email at info@ercs.org.et or reach us by phone at +251-11-123-4567. You can also visit our office in Addis Ababa, Monday to Friday, 9 AM to 5 PM.",
    q6: "What languages are supported on the platform?",
    a6: "Currently, the platform supports English and Amharic, with plans to include Arabic in the future for overseas employer access.",
    email: "Email",
    phone: "Phone",
    address: "Address",
    hours: "Office Hours",
    emailAddr: "info@tedbeer.et",
    phoneNum: "+251-11-123-4567",
    officeAddr: "Addis Ababa, Ethiopia",
    officeHours: "Monday - Friday, 9 AM - 5 PM",
    sendMessage: "Send us a Message",
    name: "Your Name",
    message: "Your Message",
    send: "Send",
  },
};



export default function HelpPage() {
  const [language, setLanguage] = useState<string>("en")
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const t = translations[language as keyof typeof translations] || translations.en

 const faqs = [
    { q: t.q1, a: t.a1 },
    { q: t.q2, a: t.a2 },
    { q: t.q3, a: t.a3 },
    { q: t.q4, a: t.a4 },
    { q: t.q5, a: t.a5 },
    { q: t.q6, a: t.a6 },
  ];

  return (
    <main className="w-full">
      <Header language={language} onLanguageChange={setLanguage} onSignupClick={() => setIsSignupOpen(true)} />

      <div className="min-h-screen bg-background pt-35 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Page Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent text-center">{t.title}</h1>

          {/* FAQ Section */}
          <section id="faq" className="mb-20 scroll-mt-20">
            <h2 className="text-3xl font-bold text-foreground mb-8">{t.faq}</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <Card
                  key={idx}
                  className="bg-card border border-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                >
                  <div className="p-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{faq.q}</h3>
                    <ChevronDown
                      className={`w-5 h-5 text-primary transition-transform ${expandedFaq === idx ? "rotate-180" : ""}`}
                    />
                  </div>
                  {expandedFaq === idx && (
                    <div className="px-6 pb-6 text-muted-foreground border-t border-border pt-4">{faq.a}</div>
                  )}
                </Card>
              ))}
            </div>
          </section>

        {/* Contact Section */}
<section id="contact" className="scroll-mt-20">
  <h2 className="text-3xl font-bold text-center text-foreground mb-8">{t.contact}</h2>
  <div className="grid md:grid-cols-2 gap-6 mb-8">
    {[
      { label: t.email, value: t.emailAddr, gradient: "from-green-100 to-green-200" },
      { label: t.phone, value: t.phoneNum, gradient: "from-blue-100 to-blue-200" },
      { label: t.address, value: t.officeAddr, gradient: "from-yellow-100 to-yellow-200" },
      { label: t.hours, value: t.officeHours, gradient: "from-purple-100 to-purple-200" },
    ].map((item, index) => (
      <Card
        key={index}
        className={`p-6 text-center rounded-lg bg-gradient-to-br ${item.gradient} border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.label}</h3>
        <p className="text-gray-700">{item.value}</p>
      </Card>
    ))}
  </div>
</section>

        </div>
      </div>

      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} language={language} />
      <Footer language={language} />
    </main>
  )
}
