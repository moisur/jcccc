import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MovingBlobs } from "@/components/MovingBlobs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Le coach JCCC avec 4 C",
  description: "Peut changer le cours de ta vie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-800`}>
        <MovingBlobs />
        <Header />
        <main className="relative z-10 pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}