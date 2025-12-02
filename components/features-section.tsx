"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { FileText, Users, Briefcase, MapPin, CheckCircle, MessageSquare, BarChart3, Shield, Globe, Zap, Lock, Bell, Target, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturesSectionProps {
  language: string;
}

const translations = {
  en: {
    title: "Powerful Features for Modern Recruitment",
    subtitle: "Everything you need to streamline overseas employment operations in one comprehensive platform",
    ctaText: "Explore All Features",
    features: [
      {
        icon: Users,
        title: "Candidate Management",
        description: "Register candidates quickly and track their progress through every stage of recruitment. Maintain all essential documents in one secure location for easy access.",
        stats: "10K+ Active Candidates",
        color: "from-blue-500 to-blue-600",
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-500",
        delay: "100ms"
      },
      {
        icon: Briefcase,
        title: "Employer & Job Order Management",
        description: "Post job orders and manage quotas seamlessly for multiple employers. Monitor fulfillment progress across destination countries.",
        stats: "500+ Active Employers",
        color: "from-blue-600 to-blue-700",
        iconBg: "bg-blue-600/10",
        iconColor: "text-blue-600",
        delay: "200ms"
      },
      {
        icon: FileText,
        title: "Document & Visa Tracking",
        description: "Automatically track passports, medical clearances, and police certificates. Receive alerts for upcoming expirations.",
        stats: "98% On-Time Processing",
        color: "from-blue-400 to-blue-500",
        iconBg: "bg-blue-400/10",
        iconColor: "text-blue-400",
        delay: "300ms"
      },
      {
        icon: Shield,
        title: "Compliance & Security",
        description: "Generate detailed compliance reports and maintain accurate audit logs. Protect sensitive data with advanced security protocols.",
        stats: "100% Regulatory Compliance",
        color: "from-blue-700 to-blue-800",
        iconBg: "bg-blue-700/10",
        iconColor: "text-blue-700",
        delay: "400ms"
      },
      {
        icon: MessageSquare,
        title: "Communication Hub",
        description: "Send SMS and email notifications for real-time status updates. Automate alerts for expiring documents.",
        stats: "24/7 Communication",
        color: "from-blue-300 to-blue-400",
        iconBg: "bg-blue-300/10",
        iconColor: "text-blue-300",
        delay: "500ms"
      },
      {
        icon: MapPin,
        title: "Multi-Country Support",
        description: "Manage deployments across UAE, Qatar, Saudi Arabia, Kuwait, and Oman. Handle country-specific regulations effortlessly.",
        stats: "5+ Countries",
        color: "from-blue-800 to-blue-900",
        iconBg: "bg-blue-800/10",
        iconColor: "text-blue-800",
        delay: "600ms"
      },
    ],
    additionalFeatures: [
      { icon: Zap, text: "Real-time Analytics Dashboard" },
      { icon: Globe, text: "Multi-language Support" },
      { icon: Lock, text: "GDPR & Data Privacy" },
      { icon: Bell, text: "Smart Notifications" },
      { icon: Target, text: "Performance Metrics" },
      { icon: Clock, text: "Time Tracking" },
      { icon: TrendingUp, text: "Growth Analytics" },
      { icon: CheckCircle, text: "Quality Assurance" }
    ]
  },
};

export function FeaturesSection({ language }: FeaturesSectionProps) {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = Array.from({ length: 8 }, (_, i) => i);
            setVisibleCards(cards);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <section 
      id="features" 
      ref={sectionRef} 
      className="relative w-full py-24 md:py-32 overflow-hidden"
    >
      {/* Background with gradient matching hero */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 via-blue-800/10 to-white"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-64 bg-gradient-to-r from-blue-500/10 to-blue-600/10 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-blue-100">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Core Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-800">Everything You Need to </span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Streamline Recruitment
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            {t.subtitle}
          </p>
          
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-blue-300 mx-auto rounded-full mb-8"></div>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {t.features.map((feature, index) => {
            const Icon = feature.icon;
            const isVisible = visibleCards.includes(index);
            const isHovered = hoveredCard === index;

            return (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card with gradient border */}
                <Card
                  className={`
                    relative p-8 bg-white/80 backdrop-blur-sm border border-gray-200/50 
                    overflow-hidden transition-all duration-500 
                    ${isHovered ? 'scale-[1.02] shadow-2xl' : 'shadow-lg hover:shadow-xl'}
                    ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'}
                  `}
                  style={{
                    animationDelay: feature.delay,
                    minHeight: "320px",
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 
                    group-hover:opacity-5 transition-opacity duration-500
                  `}></div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Icon with gradient background */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`
                        p-4 rounded-2xl ${feature.iconBg} 
                        group-hover:scale-110 transition-transform duration-500
                      `}>
                        <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                      </div>
                      
                      {/* Stats badge */}
                      <div className={`
                        px-3 py-1.5 text-xs font-medium rounded-full 
                        bg-gradient-to-r ${feature.color} text-white
                        transform transition-all duration-500
                        ${isHovered ? 'scale-110' : 'scale-100'}
                      `}>
                        {feature.stats}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed flex-grow">
                      {feature.description}
                    </p>

                    {/* Learn more link */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-blue-600 font-medium group/link">
                        <span>Learn more</span>
                        <div className={`
                          w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center
                          transform transition-all duration-300
                          ${isHovered ? 'translate-x-1 bg-blue-200' : ''}
                        `}>
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className={`
                    absolute top-0 right-0 w-16 h-16 
                    bg-gradient-to-br from-transparent via-transparent to-blue-100/50
                    rounded-bl-full transition-opacity duration-500
                    ${isHovered ? 'opacity-100' : 'opacity-0'}
                  `}></div>
                </Card>

                {/* Floating element effect */}
                <div className={`
                  absolute -inset-4 bg-gradient-to-r ${feature.color} 
                  rounded-2xl blur-xl opacity-0 group-hover:opacity-20
                  transition-all duration-700 -z-10
                `}></div>
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Plus Many More Features
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Additional tools and capabilities to enhance your recruitment workflow
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {t.additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isVisible = visibleCards.includes(index + 6);
              
              return (
                <div
                  key={index}
                  className={`
                    p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50
                    flex items-center gap-3 transition-all duration-300
                    ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'}
                    hover:bg-white hover:border-blue-200 hover:shadow-lg
                  `}
                  style={{
                    animationDelay: `${(index + 6) * 50}ms`,
                  }}
                >
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {feature.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/50">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Ready to Transform Your Recruitment Process?
              </h3>
              <p className="text-gray-600">
                Join hundreds of agencies already using TEDBEER RAMS
              </p>
            </div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 
                text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300
                px-8 py-6 text-lg font-semibold"
            >
              <span className="flex items-center gap-2">
                Start Free Trial
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}