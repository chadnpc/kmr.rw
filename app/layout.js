import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kigali Motorbike Rental - RW",
  description: "We rent motorbikes and scooters in Rwanda",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/logo-white.png" sizes="any" />
        </head>
        <body className={`${inter.className}`} cz-shortcut-listen="false">
          <AuthProvider />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />

          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>made with -`𖹭´- by chadnpc</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
