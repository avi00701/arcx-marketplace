import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { WalletProvider } from "@/context/WalletContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AdminProvider } from "@/context/AdminContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WalletModal from "@/components/ui/WalletModal";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArcX | Modern NFT Marketplace",
  description: "The next generation of digital asset trading. Premium, secure, and fast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <WalletProvider>
            <AdminProvider>
              <FavoritesProvider>
                <Navbar />
                <main className="flex-1 pt-24">
                  {children}
                </main>
                <Footer />
                <WalletModal />
              </FavoritesProvider>
            </AdminProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
