import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PawFix AI – Instant Dog Problem Solver",
  description:
    "Get instant AI-powered answers to all your dog questions. Food safety, emergency help, behavior analysis, and feeding guides.",
  keywords: ["dog", "pet", "AI", "food safety", "veterinary", "dog help"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#faf9f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <div className="mx-auto max-w-lg min-h-dvh">{children}</div>
      </body>
    </html>
  );
}
