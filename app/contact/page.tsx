"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { FaGithub, FaLinkedin, FaYoutube, FaWhatsapp,FaEnvelope, FaMapMarkerAlt} from "react-icons/fa";
import { 
  BarChart, Search, Users, Bot, Network, FileBarChart, Shield ,Phone,Mail,MapPin
} from "lucide-react"

export default function ContactPage() {
  const [language, setLanguage] = useState<string>("en")
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  return (
    <main className="w-full">
      {/* Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onSignupClick={() => setIsSignupOpen(true)}
      />
<section
  className="relative bg-cover bg-center bg-no-repeat py-20 md:py-28"
>


  <div className="relative max-w-6xl mx-auto px-6 md:px-12">
    <div className="grid md:grid-cols-2 gap-12 items-start">

      {/* Left: Get in Touch Text */}
      <div className="text-gray-800 flex flex-col justify-center">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">
         Reach Out Today
        </h3>
        <p className="text-lg md:text-xl leading-relaxed text-gray-700">
          Whether you have a question, need support, or want to explore our services, we're here to help! 
          Our dedicated team is always ready to assist you with personalized solutions and expert guidance.
          <br /><br />
    We’re just a message away connect with us today and let us help your business succeed with our tailored solutions and expert support.            <br /><br />
              Reach out to us through any of the options below  we’d love to hear from you and help your business thrive with our innovative technology and customer-first approach.
        </p>
      </div>

      {/* Right: Contact Form */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 md:p-12">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

          {/* Name & Email */}
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="your full name"
              required
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-5 py-4 text-gray-800 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all shadow-sm"
            />
            <input
              type="email"
              placeholder="example@gmail.com"
              required
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-5 py-4 text-gray-800 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Phone & Subject */}
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="tel"
              placeholder="+251-911-923322"
              required
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-5 py-4 text-gray-800 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all shadow-sm"
            />
            <input
              type="text"
              placeholder="Subject"
              required
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-5 py-4 text-gray-800 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Message */}
<textarea
  rows={6}
  placeholder="Your Message"
  required
  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-5 py-4 text-gray-800 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all shadow-sm"
  style={{ resize: 'none' }}
></textarea>



          {/* Submit Button */}
          <button
            type="submit"
            className="hover:bg-blue-800 text-white w-full py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300"
             style={{ backgroundColor: "rgba(4,53,94,1)" }}
          >
            Send Message
          </button>

        </form>
      </div>
    </div>
  </div>
</section>


      {/* Footer */}
      <Footer language={language} />
    </main>
  )
}
