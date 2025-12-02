"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { BenefitsSection } from "@/components/benefits-section";
import { SignupModal } from "@/components/signup-modal";
import { Footer } from "@/components/footer";

export default function Home() {
	const [language, setLanguage] = useState<string>("en");
	const [isSignupOpen, setIsSignupOpen] = useState(false);

	return (
		<main className="w-full">
			<Header
				language={language}
				onLanguageChange={setLanguage}
				onSignupClick={() => setIsSignupOpen(true)}
			/>
			<HeroSection language={language} />
			<FeaturesSection language={language} />
			<BenefitsSection language={language} />
			<SignupModal
				isOpen={isSignupOpen}
				onClose={() => setIsSignupOpen(false)}
				language={language}
			/>

			<Footer language={language} />
		</main>
	);
}
