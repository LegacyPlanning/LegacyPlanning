import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Legacy Planning - Secure Your Digital Legacy",
  description: "Protect your digital assets with our intelligent Dead Man's Switch. Ensure your loved ones can access important information when they need it most.",
  keywords: ["digital legacy", "dead man's switch", "password manager", "estate planning", "digital assets"],
  openGraph: {
    title: "Legacy Planning - Secure Your Digital Legacy",
    description: "Protect your digital assets with our intelligent Dead Man's Switch.",
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
