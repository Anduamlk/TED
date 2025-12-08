"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Globe,
  Users,
  Building2,
  CheckCircle,
  Zap,
  Sparkles
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en");
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
          description: "Welcome to TEDBEER Recruitment Management System",
        });
        router.push("/dashboard/admin");
      } else if (
        formData.email === "andu@candidate.et" &&
        formData.password === "candidate123"
      ) {
        toast({
          title: "Login Successful",
          description: "Welcome to TEDBEER Dashboard",
        });
        router.push("/dashboard/employer");        
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50/30 flex flex-col relative overflow-hidden">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl p-2 border border-blue-200 shadow-lg">
          <Globe className="w-4 h-4 text-blue-600" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-sm font-medium cursor-pointer outline-none text-blue-700"
            aria-label="Select language"
          >
            <option value="en" className="text-gray-800">EN</option>
            <option value="am" className="text-gray-800">አማ</option>
          </select>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-transparent"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
      
      {/* Main Content - Centered Login Form */}
      <main className="flex-1 flex items-center justify-center p-4 pt-12">
        <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Column - Branding & Features */}
          <div className="space-y-10 animate-in fade-in duration-1000">
            {/* Logo and Branding */}
            <div className="flex items-center gap-4">
              <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
        <img 
          src="/ted.ico" 
          alt="TEDBEER Logo"
          className="w-10 h-10 object-contain"
        />
      </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-blue-600">✓</span>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  TEDBEER
                </h1>
                <p className="text-blue-700/80 font-medium">
                  Recruitment Management System
                </p>
              </div>
            </div>

            {/* Tagline */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">Secure Platform Access</span>
              </div>
              
              <h2 className="text-5xl font-bold text-blue-900 mb-6">
                Welcome Back to <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">TEDBEER</span>
              </h2>
              
              <p className="text-lg text-blue-700/80 leading-relaxed">
                Access your recruitment management dashboard and continue transforming your agency operations with cutting-edge technology.
              </p>
            </div>

        
          </div>

          {/* Right Column - Login Card */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <Card className="shadow-[0_25px_60px_-15px_rgba(59,130,246,0.4)] border-2 border-blue-200/50 backdrop-blur-md bg-white/95 relative overflow-hidden">
              
              {/* Gradient Border Glow */}
              <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-blue-500/20 rounded-xl blur-lg opacity-50 pointer-events-none"></div>
              
              {/* Card Content */}
              <CardHeader className="text-center pb-6 space-y-2 relative z-10">
                <CardTitle className="text-2xl font-bold text-blue-900">
                  Sign In to Your Account
                </CardTitle>
                <CardDescription className="text-blue-700/80">
                  Enter your credentials to access the platform
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6 relative z-10">
                {error && (
                  <Alert
                    variant="destructive"
                    className="animate-in fade-in duration-300 border-red-200 bg-red-50/80 shadow-md backdrop-blur-sm"
                  >
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-3">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-blue-900"
                    >
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-12 h-14 rounded-xl border-2 border-blue-200 bg-blue-50/50 focus:border-blue-500 focus:ring-3 focus:ring-blue-200/50 outline-none transition-all duration-300 text-base shadow-sm"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-blue-900"
                    >
                      Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-12 pr-12 h-14 rounded-xl border-2 border-blue-200 bg-blue-50/50 focus:border-blue-500 focus:ring-3 focus:ring-blue-200/50 outline-none transition-all duration-300 text-base shadow-sm"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors"
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
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 shadow-sm"
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm text-blue-700 cursor-pointer"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.02] relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    {/* Button Glow Effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>

                    <span className="relative z-10 flex items-center justify-center space-x-3">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">   
                    <div className="w-full border-t border-blue-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-blue-700/80">New to TEDBEER?</span>
                  </div>
                </div>

                {/* Register Links */}
                <div className="grid grid-cols-3 gap-3">
                  <Link href="/register/candidate">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group"
                    >
                      <Users className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Candidate</span>
                    </Button>
                  </Link>
                  
                  <Link href="/register/employer">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group"
                    >
                      <Building2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Employer</span>
                    </Button>
                  </Link>
                  
                  <Link href="/register/agency">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group"
                    >
                      <Users className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Agency</span>
                    </Button>
                  </Link>
                </div>

                {/* Support Info */}
                <div className="text-center text-sm text-blue-700/80 border-t border-blue-100 pt-6">
                  <p className="mb-2">Need help? Our support team is here for you</p>
                  <a
                    href="mailto:support@tedbeer.com"
                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                  >
                    support@tedbeer.com
                  </a>
                  <div className="text-xs text-blue-600/60 mt-2">
                    24/7 Support • Response within 2 hours
                  </div>
                </div>
              </CardContent>

              {/* Decorative Sparkles */}
              <div className="absolute -top-4 -right-4 w-8 h-8 opacity-20">
                <Sparkles className="w-full h-full text-blue-400" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 opacity-20">
                <Sparkles className="w-full h-full text-cyan-400" />
              </div>
            </Card>

            {/* Quick Links */}
            <div className="mt-8 flex justify-center gap-6">
              <Link
                href="/"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Additional Background Elements */}
      <div className="absolute bottom-10 left-10 opacity-5 pointer-events-none">
        <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute top-10 right-10 opacity-5 pointer-events-none">
        <div className="w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}