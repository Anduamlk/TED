"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Globe, ChevronDown, User, Clock, Target, Users, Search, BarChart, Bot, Network, FileBarChart, Shield, Briefcase, Building2, UserCog, HelpCircle, Mail, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

interface HeaderProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  onSignupClick?: () => void;
}

const translations = {
  en: {
    home: "Home",
    aboutUs: "About Us",
    contact: "Contact Us",
    services: "Services",
    getInvolved: "Get Started",
    help: "Help",
    history: "History",
    mission: "Mission",
    team: "Team",
    programs: "Candidate Sourcing",
    impactStories: "Applicant Tracking System",
    recruitment: "Recruitment AMS",
    ai: "AI Candidate Enrichment",
    collaborative: "Collaborative & Activites",
    profile:"Candidate Registration & Profiling",
    order:"Job Order Management",
    travel:"Travel & Deployment Logistics",
    report: "Report & Analytics",
    data: "Data Privacy Compliance",
    support: "Support & Assistance",
    volunteer: "Volunteer",
    becomeMember: "Become Member",
    donate: "Donate",
    faq: "FAQ",
    signup: "Sign Up",
    login: "Login",
    candidateRegister: "Register as Candidate",
    employerRegister: "Register as Employer",
    agencyRegister: "Register as Agency",
  },
};

export function Header({ language, onLanguageChange, onSignupClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const t = translations[language as keyof typeof translations] || translations.en;

  const navItems = [
    {
      label: t.home,
      href: "/",
      dropdown: null,
    },
    {
      label: t.aboutUs,
      href: "/about",
    },
    {
      label: t.contact,
      href: "/contact",
    },
    {
      label: t.services,
      href: "/services",
    },
    {
      label: t.getInvolved,
      href: "/get-involved",
    },
    {
      label: t.help,
      href: "/help",
    },
  ];

  const handleNavClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setOpenDropdown(null);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-xl py-0" 
          : "bg-gradient-to-b from-blue-900/90 via-blue-800/80 to-transparent py-4"
      }`}
    >
      {/* Animated border line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent transition-all duration-700 ${
        isScrolled ? "opacity-0" : "opacity-100"
      }`}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with improved styling */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group flex-shrink-0"
          >
            {/* Logo Container with background */}
            <div className={`relative flex items-center justify-center transition-all duration-500 ${
              isScrolled ? "w-12 h-12" : "w-14 h-14"
            }`}>
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-500"></div>
              
              {/* Logo with frame */}
              <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-105">
                <img 
                  src="/ted.ico" 
                  alt="TEDBEER Recruitment Agency Management System" 
                  className={`object-contain transition-all duration-500 ${
                    isScrolled ? "w-8 h-8" : "w-10 h-10"
                  }`}
                />
              </div>
            </div>

            {/* Text Logo */}
            <div className="flex flex-col">
              <div className={`font-bold tracking-tight transition-all duration-500 ${
                isScrolled 
                  ? "text-blue-800 text-lg" 
                  : "text-white text-xl"
              }`}>
                TEDBEER
              </div>
              <div className={`text-xs transition-all duration-500 ${
                isScrolled 
                  ? "text-blue-600 opacity-80" 
                  : "text-blue-200 opacity-90"
              }`}>
                Recruitment Management System
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-1 w-full max-w-2xl">
            {navItems.map((item, index) => {
              const isItemActive = isActive(item.href);
              return (
                <div 
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setHoveredNavItem(item.href)}
                  onMouseLeave={() => setHoveredNavItem(null)}
                >
                  <Link
                    href={item.href}
                    className={`
                      relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300
                      ${isScrolled 
                        ? isItemActive
                          ? "text-blue-600 bg-blue-50"
                          : hoveredNavItem === item.href
                            ? "text-blue-600 bg-blue-50/80"
                            : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50"
                        : isItemActive
                          ? "text-white bg-white/20"
                          : hoveredNavItem === item.href
                            ? "text-white bg-white/15"
                            : "text-blue-100 hover:text-white hover:bg-white/10"
                      }
                    `}
                  >
                    {item.label}
                    
                    {/* Animated underline */}
                    <span className={`
                      absolute bottom-0 left-1/2 transform -translate-x-1/2 
                      h-0.5 bg-gradient-to-r from-blue-400 to-blue-300 
                      transition-all duration-500 rounded-full
                      ${hoveredNavItem === item.href || isItemActive ? "w-3/4 opacity-100" : "w-0 opacity-0"}
                    `}></span>
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Language Selector with improved styling */}
            <div className={`
              flex items-center gap-2 rounded-lg p-2 transition-all duration-300
              ${isScrolled 
                ? "bg-blue-50 border border-blue-100" 
                : "bg-white/10 backdrop-blur-sm border border-white/20"
              }
              hover:shadow-lg hover:scale-105
            `}>
              <Globe className={`w-4 h-4 transition-colors duration-300 ${
                isScrolled ? "text-blue-600" : "text-blue-200"
              }`} />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
                className={`
                  bg-transparent text-sm font-medium cursor-pointer outline-none transition-colors duration-300
                  ${isScrolled ? "text-gray-700" : "text-white"}
                `}
                aria-label="Select language"
              >
                <option value="en" className="text-gray-800">EN</option>
                <option value="am" className="text-gray-800">አማ</option>
              </select>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <Button 
                variant="ghost" 
                className={`
                  transition-all duration-300
                  ${isScrolled 
                    ? "text-gray-600 hover:text-blue-600 hover:bg-blue-50" 
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                  }
                `}
                onClick={() => router.push("/login")}
              >
                {t.login}
              </Button>
              <Button 
                onClick={() => router.push("/signup-selection")} 
                className={`
                  transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5
                  ${isScrolled 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" 
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                  }
                `}
              >
                <span className="relative z-10">{t.signup}</span>
                {/* Button glow effect */}
                <span className="absolute inset-0 bg-blue-400/30 blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`
                lg:hidden p-3 rounded-lg transition-all duration-300
                ${isScrolled 
                  ? "bg-blue-50 hover:bg-blue-100 text-gray-700" 
                  : "bg-white/10 hover:bg-white/20 text-white"
                }
              `}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden animate-slide-down">
          {/* Mobile overlay with gradient */}
          <div className="fixed inset-0 bg-gradient-to-b from-blue-900/95 via-blue-800/90 to-blue-900/95 backdrop-blur-lg z-40"></div>
          
          {/* Mobile menu content */}
          <div className="fixed inset-x-0 top-20 z-50 animate-slide-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const isItemActive = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`
                          flex items-center justify-between w-full text-left px-4 py-4 rounded-xl
                          transition-all duration-300 group
                          ${isItemActive 
                            ? "bg-blue-50 text-blue-700" 
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          }
                        `}
                      >
                        <span className="font-semibold text-lg">{item.label}</span>
                        <div className={`
                          w-2 h-2 rounded-full transition-all duration-300
                          ${isItemActive ? "bg-blue-500 scale-125" : "bg-blue-300 group-hover:scale-125"}
                        `}></div>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile auth buttons */}
                <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    className="w-full py-6 text-lg border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                    onClick={() => {
                      router.push("/login");
                      setIsOpen(false);
                    }}
                  >
                    {t.login}
                  </Button>
                  <Button 
                    className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                    onClick={() => {
                      router.push("/signup-selection");
                      setIsOpen(false);
                    }}
                  >
                    {t.signup}
                  </Button>
                </div>

                {/* Language selector in mobile */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-3">
                    <Globe className="w-5 h-5 text-gray-600" />
                    <select
                      value={language}
                      onChange={(e) => {
                        onLanguageChange(e.target.value);
                        setIsOpen(false);
                      }}
                      className="bg-transparent text-lg font-medium cursor-pointer outline-none text-gray-700"
                      aria-label="Select language"
                    >
                      <option value="en" className="text-gray-800">English</option>
                      <option value="am" className="text-gray-800">አማርኛ</option>
                    </select>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}