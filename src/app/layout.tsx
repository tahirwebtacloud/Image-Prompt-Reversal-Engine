import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Post Analyzer — AI Image Analysis for Social Media",
  description:
    "Reverse-engineer social media post designs with AI. Get prompts, color palettes, typography analysis, and actionable improvement recommendations powered by Gemini 3 Pro.",
  icons: { icon: "/favicon.ico" },
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  themeColor: "#0A66C2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevent zooming issues on inputs
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
