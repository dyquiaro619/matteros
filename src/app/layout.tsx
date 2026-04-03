import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MatterOS — Practice Management for Immigration Firms | Automation Legal",
  description:
    "MatterOS is the practice management platform built for humanitarian immigration firms. Matter tracking, policy monitoring, AI-powered intake, and more.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-flash: set theme before first paint */}
        <script dangerouslySetInnerHTML={{
          __html: `try{document.documentElement.setAttribute('data-theme',localStorage.getItem('matteros-theme')||'dark')}catch(e){}`
        }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
