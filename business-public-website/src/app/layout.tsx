import type { Metadata } from "next";
import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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
  title: "Sanchay Path | Work in Progress",
  description: "Sanchay Path - Invest Today, Grow Tomorrow. Our website is running and currently undergoing active development. Launching soon!",
  keywords: ["Sanchay Path", "Investment", "Finance", "Coming Soon", "Under Construction", "Website Running"],
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
