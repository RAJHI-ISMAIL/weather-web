import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TEMPORA — Your world. In every forecast.",
  description:
    "An immersive, interactive 3D weather experience. Explore real-time conditions, global forecasts, and atmospheric insights across a living Earth.",
  keywords: ["weather", "3D Earth", "interactive globe", "forecast", "climate", "TEMPORA"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-[#050B14] text-[#F8FAFC] antialiased selection:bg-[#22D3EE]/30 selection:text-[#F8FAFC] font-sans">
        {children}
      </body>
    </html>
  );
}
