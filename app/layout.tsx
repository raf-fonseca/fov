import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";

// import { Toaster } from "react-hot-toast";
// import AuthSessionProvider from "@/lib/AuthSession";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FOV",
  description: "FOV is a platform for in-game advertising.",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} bg-[#03060B] dark`}
      >
        <NextTopLoader
          color="purple"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2}
          showSpinner={false}
          crawl={true}
          easing="ease"
          speed={200}
          shadow="0 0 5px #2299DD,0 0 5px #2299DD"
        />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: "#1e293b",
              color: "#fff",
            },
            success: {
              duration: 5000,
              style: {
                background: "#1e293b",
                color: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
