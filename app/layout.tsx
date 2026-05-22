import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Startup Academy — Aprenda Startups com IA",
  description:
    "Plataforma de ensino sobre startups de tecnologia com 35 módulos gerados por IA. Aprenda com conhecimento real de Steve Blank, Eric Ries, Clayton Christensen, Peter Thiel e outros autores consagrados.",
  keywords: [
    "startups",
    "empreendedorismo",
    "tecnologia",
    "lean startup",
    "MVP",
    "product-market fit",
    "venture capital",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#07101C] text-gray-100 font-[family-name:var(--font-geist-sans)]">
        {children}
      </body>
    </html>
  );
}
