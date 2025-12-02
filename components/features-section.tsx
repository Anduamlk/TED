"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { FileText, Users, Briefcase, MapPin, CheckCircle, MessageSquare, BarChart3, Shield } from "lucide-react";

interface FeaturesSectionProps {
  language: string;
}

const translations = {
  en: {
   title: "Efficient Features for Your Recruitment",
subtitle: "A complete suite of tools designed to simplify, automate, and optimize overseas recruitment management",
    features: [
      {
        icon: Users,
        title: "Candidate Management",
        description: "Register candidates quickly and track their progress through every stage of recruitment. Maintain all essential documents in one secure location for easy access. Streamline placement workflows from initial application to final deployment, ensuring no detail is missed.",
      },
      {
        icon: Briefcase,
        title: "Job Order & Employer Management",
        description: "Post job orders and manage quotas seamlessly for multiple employers. Keep detailed records of employer profiles and requirements. Monitor fulfillment progress across destination countries, ensuring transparency and efficiency in recruitment operations.",
      },
      {
        icon: FileText,
        title: "Document & Visa Tracking",
        description: "Automatically track passports, medical clearances, and police certificates for all candidates. Receive alerts for upcoming visa expirations and pending documentation. Maintain full visibility of visa processing status to prevent delays and ensure compliance.",
      },
      {
        icon: Shield,
        title: "Compliance & Reporting",
        description: "Generate detailed regulatory compliance reports and maintain accurate audit logs. Protect sensitive candidate and employer data with advanced security protocols. Submit required documentation to the Ministry of Labour efficiently and accurately.",
      },
      {
        icon: MessageSquare,
        title: "Communication Hub",
        description: "Send SMS and email notifications to candidates and employers for real-time status updates. Automate alerts for expiring documents or pending actions. Generate official documents and notifications quickly, keeping all parties informed and engaged.",
      },
      {
        icon: MapPin,
        title: "Multi-Country Support",
        description: "Manage deployments across multiple countries including Dubai, Qatar, Saudi Arabia, Kuwait, and Oman. Handle country-specific regulations and documentation requirements effortlessly. Ensure smooth placement operations across all authorized destination countries.",
      },
    ],
  },
};


export function FeaturesSection({ language }: FeaturesSectionProps) {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
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
    <section id="features" ref={sectionRef} className="w-full py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">{t.subtitle}</p>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </div>

        {/* Features Grid: 2 cards per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.features.map((feature, index) => {
            const Icon = feature.icon;
            const isVisible = visibleCards.includes(index);

            return (
              <Card
                key={index}
                className={`p-8 bg-card hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border border-border group ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  minHeight: "350px", // Set height for better visibility
                }}
              >
                <div className="flex flex-col items-center justify-center gap-4 text-center h-full">
                  <div className="p-4 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors duration-300">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mt-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">{feature.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
