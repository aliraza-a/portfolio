// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ali Raza | Web Developer & Head of Production",
  description:
    "Results-driven Web Developer with 4+ years of experience delivering high-performance websites and web applications. Expert in React, Next.js, and modern frontend technologies.",
  keywords: [
    "Web Developer",
    "React Developer",
    "Next.js Developer",
    "Frontend Developer",
    "Karachi",
    "Pakistan",
  ],
  authors: [{ name: "Ali Raza" }],
  openGraph: {
    title: "Ali Raza | Web Developer & Head of Production",
    description:
      "Results-driven Web Developer with 4+ years of experience delivering high-performance websites.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
