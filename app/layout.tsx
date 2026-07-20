import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lao95z953.pages.dev"),
  title: "LAO_Z_3 — Security Field Notes / 資安學習筆記",
  description:
    "LAO_Z_3 的 CTF、Web Security、AI Security、Rev 與 Pwn 學習筆記。",
  applicationName: "LAO_Z_3 Security Field Notes",
  authors: [{ name: "LAO_Z_3", url: "https://github.com/lao95z953" }],
  creator: "LAO_Z_3",
  openGraph: {
    title: "LAO_Z_3 — Security Field Notes / 資安學習筆記",
    description:
      "持續學習中的資安實踐者，主要領域為 Web 與 AI Security，正在學習 Rev 與 Pwn。",
    url: "https://lao95z953.pages.dev",
    siteName: "LAO_Z_3 Security Field Notes",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "LAO_Z_3 — Security Field Notes / 資安學習筆記",
    description:
      "持續學習中的資安實踐者，主要領域為 Web 與 AI Security，正在學習 Rev 與 Pwn。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${instrumentSerif.variable} ${inter.variable} ${ibmPlexMono.variable}`}
      >
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
        />
        {children}
      </body>
    </html>
  );
}
