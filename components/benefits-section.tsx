"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Globe, Shield } from "lucide-react";

interface BenefitsSectionProps {
	language: string;
}

const translations = {
	en: {
		title: "Why Everyone Relies on TEDBEER",
		subtitle: "Streamlined overseas employment management for recruitment agencies",
		stats: [
			{ value: "50+", label: "Active Agencies" },
			{ value: "1000+", label: "Candidates Managed" },
			{ value: "15+", label: "Destination Countries" },
			{ value: "99%", label: "Success Rate" },
		],
		features: [
			{
				icon: TrendingUp,
				title: "End-to-End Management",
				description: "Complete candidate lifecycle from registration to deployment with visa tracking",
			},
			{
				icon: Users,
				title: "Candidate Pool",
				description: "Access qualified candidates by skills and preferred destination",
			},
			{
				icon: Globe,
				title: "Multi-Country Support",
				description: "Manage placements across Dubai, Qatar, Saudi Arabia and more",
			},
			{
				icon: Shield,
				title: "Compliance First",
				description: "Stay compliant with Ethiopian regulations and international standards",
			},
		],
		testimonials: [
			{
				quote: "TEDBEER has transformed how we manage overseas recruitment. We've increased our placement success rate by 40%.",
				author: "Ato Alemayehu Tadesse",
				role: "Director, Elite Employment Agency",
			},
			{
				quote: "The automated visa tracking system saves us hours every day. Real-time status updates keep us ahead.",
				author: "W/ro Zewditu Mengistu",
				role: "Operations Manager, Global Recruit",
			},
			{
				quote: "Managing multiple destination countries is now seamless. TEDBEER handles compliance across all jurisdictions.",
				author: "Ato Bereket Ashenafi",
				role: "CEO, Horizon Recruitment",
			},
		],
		heatmapCaption: "Live Recruitment Insights Across Destination Countries"
	},
};

export function BenefitsSection({ language }: BenefitsSectionProps) {
	const [currentTestimonial, setCurrentTestimonial] = useState(0);
	const sectionRef = useRef<HTMLDivElement>(null);

	const t = translations[language as keyof typeof translations] || translations.en;

	// Auto-rotate testimonials
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTestimonial((prev) => (prev + 1) % t.testimonials.length);
		}, 6000);

		return () => clearInterval(timer);
	}, [language]);

	return (
		<section id="about" ref={sectionRef} className="w-full py-20 bg-background">
			<div className="max-w-7xl mx-auto px-4">
				{/* Section Title */}
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
						{t.title}
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
						{t.subtitle}
					</p>
					<div className="w-16 h-1 bg-primary mx-auto rounded-full" />
				</div>

		{/* Stats Grid */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
  {t.stats.map((stat, index) => {
    // Define a set of pastel gradient colors
    const gradients = [
      "from-green-100 to-green-200",
      "from-blue-100 to-blue-200",
      "from-yellow-100 to-yellow-200",
      "from-purple-100 to-purple-200",
    ];

    const gradient = gradients[index % gradients.length]; // Cycle through colors

    return (
      <Card
        key={index}
        className={`p-6 text-center bg-gradient-to-br ${gradient} border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105`}
      >
        <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {stat.value}
        </div>
        <p className="text-sm md:text-base text-gray-700 font-medium">
          {stat.label}
        </p>
      </Card>
    );
  })}
</div>


				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
					{t.features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<Card
								key={index}
								className="p-6 bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
							>
								<div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20 transition-colors">
									<Icon className="w-6 h-6 text-primary" />
								</div>
								<h3 className="text-lg font-semibold text-foreground mb-2">
									{feature.title}
								</h3>
								<p className="text-sm text-muted-foreground">
									{feature.description}
								</p>
							</Card>
						);
					})}
				</div>

				{/* Testimonials and Heatmap */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Testimonials */}
					<div className="space-y-6">
						<div className="relative h-64">
							{t.testimonials.map((testimonial, index) => (
								<div
									key={index}
									className={`transition-all duration-500 absolute inset-0 ${
										index === currentTestimonial
											? "opacity-100 visible"
											: "opacity-0 invisible"
									}`}
								>
									<Card className="p-8 bg-card border border-border h-full flex flex-col justify-between">
										<p className="text-lg text-foreground mb-6 italic">
											"{testimonial.quote}"
										</p>
										<div>
											<p className="font-bold text-foreground">
												{testimonial.author}
											</p>
											<p className="text-sm text-muted-foreground">
												{testimonial.role}
											</p>
										</div>
									</Card>
								</div>
							))}
						</div>

						{/* Testimonial Indicators */}
						<div className="flex gap-2 justify-center">
							{t.testimonials.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentTestimonial(index)}
									className={`h-2 rounded-full transition-all ${
										index === currentTestimonial
											? "bg-primary w-8"
											: "bg-muted-foreground w-2"
									}`}
									aria-label={`Testimonial ${index + 1}`}
								/>
							))}
						</div>
					</div>

				{/* Dashboard Image */}
<div className="flex flex-col items-center">
  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-2xl border-2 border-border">
    <Image
      src="ceo.jpg"
      alt={t.heatmapCaption}
      fill
      className="object-cover" // Cover the entire div without stretching
    />
  </div>
  <p className="text-center text-sm text-muted-foreground mt-4 max-w-md">
    {t.heatmapCaption}
  </p>
</div>


				</div>
			</div>
		</section>
	);
}

