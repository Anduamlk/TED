"use client"

import Link from "next/link"
import { Facebook, Twitter, Linkedin, Mail, ArrowUp, Building2, Briefcase, User, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FooterProps {
  language: string
}

const translations = {
  en: {
    company: " AFA RAMS",
    tagline: " AFA Recruitment Agency Management System - Streamlining overseas employment from candidate registration to successful deployment.",
    quickLinks: "Quick Links",
    contact: "Contact Us",
    services: "Services",
    about: "About Us",
    help: "Help",
    register: "Register",
    registerCandidate: "As Candidate",
    registerEmployer: "As Employer",
    registerAgency: "As Agency",
    support: "Support",
    faq: "FAQ",
    contactUs: "Contact Us",
    documentation: "Documentation",
    legal: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    compliance: "Compliance",
    contactInfo: "Contact",
    email: "Email",
    phone: "Phone",
    address: "Address",
    emailValue: "info@rams.com",
    phoneValue: "+251 98 384 4810",
    addressValue: "Addis Ababa, Ethiopia",
    copyright: "© 2025  AFA Recruitment Agency Management System. All rights reserved.",
    backToTop: "Back to Top",
    followUs: "Follow Us",
  },
}

export function Footer({ language }: FooterProps) {
  const t = translations[language as keyof typeof translations] || translations.en

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
   <footer className="w-full text-background" style={{ backgroundColor: "rgba(12,35,54,1)" }}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <p className="text-sm text-background/80 leading-relaxed">{t.tagline}</p>
            
            {/* Social Icons */}
            <div className="flex gap-3 pt-4">
              <Link
                href="#"
                className="p-3 bg-background/10 hover:bg-primary rounded-lg transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="p-3 bg-background/10 hover:bg-primary rounded-lg transition-all hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="p-3 bg-background/10 hover:bg-primary rounded-lg transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:info@rams.org"
                className="p-3 bg-background/10 hover:bg-primary rounded-lg transition-all hover:scale-110"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links & Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ArrowUp className="w-4 h-4 rotate-[-45deg]" />
              {t.quickLinks}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/get-involved" className="text-background/80 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Get Involved
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-background/80 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  {t.about}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-background/80 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  {t.services}
                </Link>
              </li>
                <li>
                <Link href="/contact" className="text-background/80 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Registration Types */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              {t.register}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/register/candidate" className="text-background/80 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  <User className="w-3.5 h-3.5" />
                  {t.registerCandidate}
                </Link>
              </li>
              <li>
                <Link href="/register/employer" className="text-background/80 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  <Briefcase className="w-3.5 h-3.5" />
                  {t.registerEmployer}
                </Link>
              </li>
              <li>
                <Link href="/register/agency" className="text-background/80 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  <Building2 className="w-3.5 h-3.5" />
                  {t.registerAgency}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              {t.support}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-background/80 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  {t.faq}
                </Link>
              </li>
              <li className="pt-2">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <a href={`mailto:${t.emailValue}`} className="text-background/80 hover:text-primary transition-colors text-sm">
                    {t.emailValue}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-background/80 text-sm">{t.phone}: {t.phoneValue}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Compliance Section */}
        <div className="border-t border-background/20 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">{t.legal}</h4>
              <ul className="space-y-1">
                <li>
                  <Link href="/privacy" className="text-background/80 hover:text-primary transition-colors">
                    {t.privacy}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-background/80 hover:text-primary transition-colors">
                    {t.terms}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t.compliance}</h4>
              <ul className="space-y-1">
                <li className="text-background/80">
                  Ministry of Labour & Skills Compliant
                </li>
                <li className="text-background/80">
                  Data Privacy Regulations
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t.contactInfo}</h4>
              <p className="text-background/80 text-sm">{t.addressValue}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/20 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/80 text-center md:text-left">{t.copyright}</p>

          {/* Back to Top Button */}
          <Button
            onClick={scrollToTop}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 transition-all hover:scale-110"
            aria-label={t.backToTop}
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </footer>
  )
}

