import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { base, sepolia } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT as string;

const metadata = {
  name: "Impact Explorer",
  description: "An Impactscribe product",
  url: "https://impact-explorer.vercel.app",
  icons: ["https://avatars.mywebsite.com/"],
};

const chains = [base, sepolia] as const;
export const config = defaultWagmiConfig({
  chains: chains,
  projectId,
  metadata,
  cacheTime: 1000,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
