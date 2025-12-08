import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: " TEDBEER Recruitment System",
  description: "Streamline overseas employment operations for Ethiopian recruitment agencies...",
  generator: "ProAll22 developed according to UniTech IT specifications",
  keywords: "RAMS, recruitment system, overseas employment, job placement, visa processing, agency management, Ethiopia",
  openGraph: {
    title: "TEDBEER Recruitment Agency Management System",
    description: "Empowering Ethiopian recruitment agencies through digital automation of candidate, employer, and visa management workflows.",
    type: "website",
  },
  // Add icons configuration
  icons: {
    icon: '/ted.ico',
    shortcut: '/ted.ico',
    apple: '/ted.ico',
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
  
  {/* Favicon links - multiple formats for better compatibility */}
  <link rel="shortcut icon" href="/ted.ico" type="image/x-icon" />
  <link rel="icon" href="/ted.ico" type="image/x-icon" />
  <link rel="apple-touch-icon" href="/ted.ico" />
  
  {/* Force no caching for favicon during development */}
  {process.env.NODE_ENV === 'development' && (
    <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  )}
</head>
			<body className={`font-sans antialiased`}>{children}</body>
		</html>
	);
}
