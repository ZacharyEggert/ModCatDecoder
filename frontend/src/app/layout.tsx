import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "PRS MODCAT Decoder",
  description:
    "A fork of the ModCat Decoder tool by DChandlerP https://github.com/DChandlerP/ModCatDecoder/",
  icons: [{ rel: "icon", url: "favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} bg-neutral-900`}>
      <body className="w-full bg-linear-to-b from-neutral-900 to-neutral-600 text-white">
        {children}
      </body>
    </html>
  );
}
