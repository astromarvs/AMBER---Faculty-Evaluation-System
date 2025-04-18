// layout.jsx (Server Component)
import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import SideBar from "./components/Sidebar";
import { Providers } from "./Providers";

export const metadata = {
  title: "Amber Faculty Evaluation System",
  description: "Smart Educational Institution",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const AppLayout = ({ children }) => {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Providers>
          <Navbar />
          <div className="flex">
            {/* Sidebar will only render if there's a session */}
            <div className="hidden lg:block">
              <SideBar />
            </div>
            <main className="flex-1 min-h-screen">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default AppLayout;