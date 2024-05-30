import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/ui/navbar";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talle IRB Racing",
  description: "Talle IRB Racing Team administration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
