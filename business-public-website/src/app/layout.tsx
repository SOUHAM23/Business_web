import type { Metadata } from "next";
import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "../styles/header.css";
import "../styles/hero.css";

const cinzel = Cinzel({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sanchay Path | সমৃদ্ধির নতুন দিশারি | Sukanta Dutta (ARN: 347438)",
  description: "Sukanta Dutta - AMFI-Registered Mutual Fund Distributor (ARN: 347438) with 15+ years of banking & financial services experience. Goal-oriented SIPs, retirement & family protection planning.",
  keywords: [
    "Sanchay Path",
    "Sukanta Dutta",
    "AMFI Registered Distributor",
    "ARN 347438",
    "Mutual Funds Barrackpore",
    "SIP Planning West Bengal",
    "Financial Planning",
    "Retirement Planning",
    "Life & Health Insurance"
  ],
  icons: {
    icon: "/Logo.png",
    shortcut: "/Logo.png",
    apple: "/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${jakartaSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
