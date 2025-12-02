"use client";

import { useEffect, useState } from "react";
import { ArrowRight, PlayCircle, Download } from "lucide-react";

interface HeroSectionProps {
  language: string;
}

const translations = {
  en: {
    headline: "Digitizing the Future of Ethiopian Recruitment",
    subheadline: "TEDBEER Unified Digital Platform for Overseas Employment Operations",
    description: `Streamline your agency's workflow with our comprehensive Recruitment Agency Management System. 
    Seamlessly manage candidates, employers, job orders, visa workflows, and travel logistics from a single, 
    secure platform designed specifically for Ethiopian recruitment agencies.`,
    ctaPrimary: "Start Free Trial",
    ctaSecondary: "Watch Demo",
    features: [
      "Candidate Management",
      "Visa Processing",
      "Employer Portal",
      "Travel Logistics",
      "Real-time Analytics",
      "Secure & Compliant"
    ]
  },
  am: {
    headline: "የኢትዮጵያ የውጭ ሥራ ወኪሎች ዲጂታል መፍትሄ",
    subheadline: "TEDBEER RAMS - ለውጭ ሥራ አስተዳደር የተሟላ ዲጂታል መድረክ",
    description: `የሚፈልጉትን የውጭ ሥራ አስተዳደር ሂደቶችን በአንድ ደህንነታዊ መድረክ ያቀናብሩ። 
    እጩዎችን፣ የቪዛ ሂደቶችን፣ አሰሪዎችን እና የጉዞ አያያዝን በቀላሉ ያስተዳድሩ።`,
    ctaPrimary: "ነፃ ሙከራ ይጀምሩ",
    ctaSecondary: "ዴሞ ይመልከቱ",
    features: [
      "የእጩ አስተዳደር",
      "የቪዛ ሂደት",
      "የአሰሪ ፖርታል",
      "የጉዞ አያያዝ",
      "ቅጽበታዊ የውጤት ትንታኔ",
      "ደህንነታዊ እና ህጋዊ"
    ]
  },
};

export function HeroSection({ language }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img
          src="bg.jpg"
          alt="Recruitment background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-blue-900/70"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-950/90"></div>
      </div>

      {/* Content Container */}
      <div className="relative container mx-auto px-4 md:px-6 lg:px-8 h-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)] py-16 md:py-20">
          {/* Left Column - Text Content */}
          <div className={`space-y-8 transition-all duration-1000 ${
            isVisible ? "animate-fade-in-left opacity-100" : "opacity-0 translate-x-10"
          }`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-700/30 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-blue-500/30">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">Trusted by 100+ Ethiopian Agencies</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">{t.headline.split(" ")[0]} </span>
              <span className="text-yellow-500">{t.headline.split(" ").slice(1, 3).join(" ")} </span>
              <span className="text-white">{t.headline.split(" ").slice(3).join(" ")}</span>
            </h1>

            {/* Subheadline */}
            <h2 className="text-xl md:text-2xl text-blue-200 font-semibold">
              {t.subheadline}
            </h2>

            {/* Description */}
            <p className="text-lg text-blue-100/90 leading-relaxed max-w-2xl">
              {t.description}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-xl">
              {t.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
                >
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/30 transition-colors">
                    <span className="text-yellow-500 text-sm">✓</span>
                  </div>
                  <span className="text-white text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group relative inline-flex items-center justify-center gap-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/30 hover:-translate-y-1">
                <span>{t.ctaPrimary}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 rounded-xl border-2 border-yellow-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button className="group inline-flex items-center justify-center gap-3 bg-transparent hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white/50 transition-all duration-300">
                <PlayCircle className="w-5 h-5" />
                <span>{t.ctaSecondary}</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              {[
                { value: "10K+", label: "Candidates" },
                { value: "500+", label: "Employers" },
                { value: "98%", label: "Satisfaction" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Image/Illustration */}
          <div className={`relative transition-all duration-1000 delay-300 ${
            isVisible ? "animate-fade-in-right opacity-100" : "opacity-0 translate-x-10"
          }`}>
            {/* Main Image Container */}
            <div className="relative">
              {/* Image with frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/50">
                <img
                  src="dashboard-preview.png" // Replace with your dashboard/UI image
                  alt="TEDBEER RAMS Dashboard Preview"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-2xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Active Candidates</div>
                    <div className="text-xl font-bold text-green-600">2,847</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl animate-float delay-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✈️</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">This Month</div>
                    <div className="text-xl font-bold text-blue-600">124 Deployments</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -z-10 bottom-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Add custom animations to CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-left {
          animation: fadeInLeft 1s ease-out;
        }
        .animate-fade-in-right {
          animation: fadeInRight 1s ease-out;
        }
      `}</style>
    </section>
  );
}