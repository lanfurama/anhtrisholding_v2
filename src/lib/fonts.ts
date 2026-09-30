import { Geist, Geist_Mono } from "next/font/google";

// Tên family "Geist" / "Geist Mono" được dùng trực tiếp trong globals.css (--font-sans / --font-mono).
export const geist = Geist({ subsets: ["latin", "latin-ext", "vietnamese"], variable: "--font-geist", display: "swap" });
export const geistMono = Geist_Mono({ subsets: ["latin", "vietnamese"], variable: "--font-geist-mono", display: "swap" });

export const fontVars = `${geist.variable} ${geistMono.variable}`;
