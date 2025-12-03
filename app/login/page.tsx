"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Building2,
  Home,
  Menu,
  X,
  Globe,
  ChevronDown,
  User,
  Clock,
  Target,
  Users,
  Search,
  BarChart,
  Bot,
  Network,
  FileBarChart,
  Shield,
  Briefcase,
  UserCog,
  HelpCircle,
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
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

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
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
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent transition-all duration-700 ${
        isScrolled ? "opacity-0" : "opacity-100"
      }`}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link 
            href="/" 
            className="flex items-center gap-3 group flex-shrink-0"
          >
            <div className={`relative flex items-center justify-center transition-all duration-500 ${
              isScrolled ? "w-12 h-12" : "w-14 h-14"
            }`}>
              <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-500"></div>
              
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

          <nav className="hidden lg:flex items-center justify-center gap-1 w-full max-w-2xl">
            {navItems.map((item) => {
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

          <div className="flex items-center gap-4">
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
                onChange={(e) => setLanguage(e.target.value)}
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
                <span className="absolute inset-0 bg-blue-400/30 blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              </Button>
            </div>

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

      {isOpen && (
        <div className="lg:hidden animate-slide-down">
          <div className="fixed inset-0 bg-gradient-to-b from-blue-900/95 via-blue-800/90 to-blue-900/95 backdrop-blur-lg z-40"></div>
          
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

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-3">
                    <Globe className="w-5 h-5 text-gray-600" />
                    <select
                      value={language}
                      onChange={(e) => {
                        setLanguage(e.target.value);
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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    
    setTimeout(() => {
      setIsLoading(false);
      if (
        formData.email === "admin@ted.com" &&
        formData.password === "admin123"
      ) {
        toast({
          title: "Login Successful",
          description: "Welcome to Recruitment Agency Management System",
        });
        router.push("/dashboard/admin");
      } else if (
        formData.email === "andu@candidate.et" &&
        formData.password === "candidate123"
      ) {
        toast({
          title: "Login Successful",
          description: "Welcome to Recruitment Agency Management Dashboard",
        });
        router.push("/dashboard/employer");        
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex flex-col relative overflow-hidden">
      <Header />
      
      {/* Main Content - Centered Login Form */}
      <main className="flex-1 flex items-center justify-center p-4 pt-24">
        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Logo and Branding */}
          <div className="text-center animate-in fade-in duration-1000">
            {/* <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-900 to-blue-900 rounded-3xl flex items-center justify-center shadow-2xl mb-6 relative">
              <Building2 className="h-12 w-12 text-white" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-gray-200">🏛️</span>
              </div>
            </div> */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              TEDBEER 
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Recruitment Agency Management System
            </p>
            <p className="text-xs text-gray-600 font-light">
              Efficient Candidate & Employer Management for Ethiopia
            </p>
          </div>
{/* Login Card */}
<Card className="shadow-[0_25px_60px_-15px_rgba(59,130,246,0.3)] border-2 border-blue-200/50 backdrop-blur-md bg-white/95 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 relative overflow-hidden">
  {/* Glowing border effect */}
  <div className="absolute inset-0 border-2 border-blue-300/20 rounded-xl pointer-events-none"></div>
  
  {/* Gradient border glow */}
  <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500/10 via-emerald-400/10 to-blue-500/10 rounded-xl blur-lg opacity-50 pointer-events-none"></div>
  
  {/* Inner glowing effect */}
  <div className="absolute inset-4 bg-gradient-to-b from-white/20 to-transparent rounded-lg pointer-events-none"></div>
  
  <CardHeader className="text-center pb-6 space-y-2 relative z-10">
    <CardTitle className="text-2xl font-bold text-gray-900">
      Welcome Back
    </CardTitle>
    <CardDescription className="text-gray-600">
      Sign in to access your dashboard
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-6 relative z-10">
    {error && (
      <Alert
        variant="destructive"
        className="animate-in fade-in duration-300 border-red-200 bg-red-50 shadow-md"
      >
        <AlertDescription className="text-red-800">
          {error}
        </AlertDescription>
      </Alert>
    )}

    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-sm font-semibold text-gray-700"
        >
          Email Address
        </Label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            className="pl-12 h-14 rounded-2xl border-2 border-gray-200 focus:border-red-800 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 text-lg shadow-sm"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-semibold text-gray-700"
        >
          Password
        </Label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pl-12 pr-12 h-14 rounded-2xl border-2 border-gray-200 focus:border-red-800 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 text-lg shadow-sm"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="remember"
            checked={formData.rememberMe}
            onCheckedChange={(checked) =>
              setFormData({
                ...formData,
                rememberMe: checked as boolean,
              })
            }
            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 shadow-sm"
          />
          <Label
            htmlFor="remember"
            className="text-sm text-gray-600 cursor-pointer"
          >
            Remember me
          </Label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
        >
          Forgot password?
        </Link>
      </div>

    <Button
  type="submit"
  className="w-full h-14 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-900 hover:to-blue-500 text-blue-100 font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.02] relative overflow-hidden"
  disabled={isLoading}
>
  {/* Blue glow effect */}
  <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-400/20 blur-xl rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></span>

  <span className="relative z-10">
    {isLoading ? (
      <div className="flex items-center justify-center space-x-3">
        <div className="w-5 h-5 border-2 border-blue-200 border-t-transparent rounded-full animate-spin" />
        <span className="text-blue-100">Signing in...</span>
      </div>
    ) : (
      <div className="flex items-center justify-center space-x-3">
        <span>Sign In</span>
        <ArrowRight className="h-5 w-5" />
      </div>
    )}
  </span>
</Button>

    </form>

    <div className="text-center text-sm text-gray-500 border-t border-gray-100 pt-6">
      Need help? Contact support at{" "}
      <a
        href="mailto:support@rams.et"
        className="text-emerald-600 hover:underline font-semibold"
      >
        support@rams.et
      </a>
    </div>

    <div className="text-center text-xs text-gray-400">
      {/* Additional footer content can go here */}
    </div>
  </CardContent>
</Card>
          {/* Ethiopian Flag Colors Footer */}
          <div className="flex justify-center space-x-2 animate-in fade-in duration-1000 delay-700">
            <div className="w-8 h-2 bg-green-500 rounded-full"></div>
            <div className="w-8 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-8 h-2 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </main>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-500 rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-500 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-yellow-500 rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-red-500 rounded-full"></div>
      </div>
    </div>
  );
}