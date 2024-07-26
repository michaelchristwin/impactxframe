import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Web3Modal from "@/providers/WalletProvider";
import { headers } from "next/headers";
import { config } from "@/config/wagmi";
import { cookieToInitialState } from "wagmi";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

const _Nunito = Nunito({
  weight: ["300", "400", "200", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Impact Explorer",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body className={_Nunito.className}>
        <Web3Modal initialState={initialState}>
          <Toaster />
          <Navbar />
          <div className={`w-full h-[100%] mt-[10px]`}>{children}</div>
        </Web3Modal>
      </body>
    </html>
  );
}
