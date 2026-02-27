import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { AuthProvider } from "./context/AuthContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Next.js E-commerce App",
  description: "A modern e-commerce application built with Next.js, featuring product listings, user authentication, and a shopping cart.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       {/* <AuthProvider> */}
       
        {children}
       {/* </AuthProvider> */}
      </body>
    </html>
  );
}
