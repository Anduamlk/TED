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
      setIsScrolled(window.scrollY > 0);
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

  // Get the currently hovered nav item's data
  const hoveredItem = navItems.find(item => item.href === hoveredNavItem);
  const showDropdown = hoveredItem && hoveredItem.dropdown && hoveredNavItem;

  return (
    <header
  className={`sticky top-0 z-50 w-full text-white transition-all duration-300 ${
    isScrolled ? "shadow-lg" : ""
  }`}
  style={{ backgroundColor: "rgba(4,53,94,1)", height: "80px" }}
>
      <div className="max-w-7xl mx-auto px-4 h-full text-white flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center justify-center">
            <img src="/afa.ico" alt="Logo" className="w-40 h-16 object-contain" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-4 w-full text-white ">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              onMouseLeave={() => !showDropdown && setHoveredNavItem(null)}
              className="text-foreground font-semibold text-white hover:text-primary transition-colors duration-200 px-3 py-2 flex items-center gap-1 rounded-lg hover:bg-muted"
            >
              {item.label}
              {item.dropdown && <ChevronDown className="w-4 h-4" />}
            </button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-2 border border-border rounded-lg p-2">
            <Globe className="w-4 h-4 text-white" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-sm font-medium cursor-pointer outline-none"
              aria-label="Select language"
            >
              <option value="en">EN</option>
              <option value="am">አማ</option>
            </select>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex items-center gap-2 ">
            <Button variant="ghost" className="text-white hover:text-primary" onClick={() => router.push("/login")}>
              {t.login}
            </Button>
            <Button onClick={() => router.push("/signup-selection")} className="bg-red-800 hover:bg-red-800 text-white">
              {t.signup}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-border animate-slide-up">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <div key={item.href}>
                <button
                  onClick={() => {
                    if (item.dropdown) {
    
                    } else {
                      handleNavClick(item.href);
                    }
                  }}
                  className="w-full text-left text-foreground font-semibold hover:text-primary transition-colors py-2 flex items-center justify-between"
                >
                  {item.label}
                 
                </button>

              
              </div>
            ))}
            <div className="flex gap-2 pt-4 border-t border-border">
            <Button variant="ghost" className="text-foreground hover:text-primary" onClick={() => router.push("/login")}>
              {t.login}
            </Button>
               <Button onClick={() => router.push("/signup-selection")} className="bg-red-800 hover:bg-primary/90 text-white">
              {t.signup}
            </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

