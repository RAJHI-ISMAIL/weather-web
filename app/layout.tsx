import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#050B14] text-[#F8FAFC] antialiased selection:bg-[#22D3EE]/30 selection:text-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}
