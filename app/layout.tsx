import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Recruitment Agency Management System",
	description:
		"Streamline overseas employment operations for Ethiopian recruitment agencies. Manage candidates, employers, job orders, visa workflows, and travel logistics with a secure, scalable digital platform.",
	generator: "ProAll22 developed according to UniTech IT specifications",
	keywords:
		"RAMS, recruitment system, overseas employment, job placement, visa processing, agency management, Ethiopia",
	openGraph: {
		title: "Recruitment Agency Management System (RAMS)",
		description:
			"Empowering Ethiopian recruitment agencies through digital automation of candidate, employer, and visa management workflows.",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<head>
				<meta name="theme-color" content="#133980ff" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				{/* Favicon */}
				<link rel="icon" href="/ted.ico" />
			</head>
			<body className={`font-sans antialiased`}>{children}</body>
		</html>
	);
}
