import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luca Tam — Neural Portfolio",
  description:
    "Computer Engineering graduate & AI/ML engineer. Building at the intersection of LLMs, 3D web, and open source.",
  openGraph: {
    title: "Luca Tam — Neural Portfolio",
    description: "Explore Luca's work through an interactive 3D neural network.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0a0a0f] text-slate-200 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
