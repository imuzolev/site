import type { Metadata, Viewport } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const sans = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "CORTEXIS — Drones of the Future",
  description:
    "Autonomous intelligence, precision and speed. Next-generation FPV, military and civilian unmanned aerial systems.",
  keywords: ["drones", "FPV", "UAV", "autonomous", "military tech", "AI navigation"],
  openGraph: {
    title: "CORTEXIS — Drones of the Future",
    description: "Autonomous Intelligence. Precision. Speed.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-ink-950 text-white antialiased">{children}</body>
    </html>
  );
}
