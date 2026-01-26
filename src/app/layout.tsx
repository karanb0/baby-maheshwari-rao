import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Baby Shower Shoe Game - Under the Sea!",
  description: "A fun, interactive baby shower game where guests vote on who they think will be the better parent in various scenarios. Dive into the fun with our under-the-sea theme!",
  keywords: ["baby shower", "shoe game", "party game", "voting game", "interactive"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
