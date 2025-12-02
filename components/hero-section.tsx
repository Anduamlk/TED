"use client";

import { useEffect, useState } from "react";

interface HeroSectionProps {
  language: string;
}

const translations = {
  en: {
    headline: "Digitizing the Future of Ethiopian AFA Recruitment",
    subheadline: `Enhance efficiency across your agency with AFA RAMS – a unified digital solution for overseas employment operations. 
Seamlessly manage candidates, employers, job orders, visa workflows, and deployments in one secure platform. 
Experience the next level of transparency, scalability, and automation.`,
  },
  am: {
    headline: "የኢትዮጵያ የውጭ ሥራ ወኪሎች ዲጂታል ለውጥ",
    subheadline: `RAMS የተባለ የውጭ ሥራ አስተዳደር የዲጂታል መፍትሄ ነው። 
እጩዎችን፣ አሰሪዎችን፣ የቪዛ ሂደቶችን እና ጉዞዎችን በአንድ ደህንነታዊ መድረክ ያቆጣጠሩ። 
ትልቅ ግልፅነትን እና ተወላጅ ሂደት ያዩ።`,
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
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ minHeight: "100vh" }}
    >
      {/* Image Background (fully visible) */}
      <img
        src="https://wallpapers.com/images/hd/dark-aesthetic-navy-blue-background-cpsisqi7rilg76ct.jpg"
        alt="Hero Image"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Text content */}
      <div
        className={`relative max-w-5xl px-6 text-center transition-all duration-1000 ${
          isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="text-5xl sm:text-5xl md:text-5xl font-bold text-yellow-700 mb-6">
          {t.headline}
        </h1>
        <p className="text-sm md:text-lg max-w-3xl mx-auto text-white">
          {t.subheadline}
        </p>
      </div>
    </section>
  );
}
