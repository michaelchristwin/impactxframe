"use server";
import { publicClient } from "@/config/client";
import { Account, WalletClient } from "viem";
import FactoryABI from "@/ABIs/ImpactNFT.json";
const impactNftFactoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as any;
export async function getNextId(): Promise<number> {
  try {
    const data = await publicClient.readContract({
      address: impactNftFactoryAddress,
      abi: FactoryABI,
      functionName: "_nextIndex",
    });
    return Number(data);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getImpactNfts({
  index,
}: {
  index: number;
}): Promise<string> {
  try {
    const data = await publicClient.readContract({
      address: impactNftFactoryAddress,
      abi: FactoryABI,
      functionName: "ImapactNFTs",
      args: [index],
    });
    return data as string;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
interface createImpactNFTProps {
  client: WalletClient;
  args: {
    maxSupply: bigint;
    unitPrice: bigint;
    reciever: string;
    defaultAdmin: string;
    defaultMetadataURI: string;
  };
}
export async function createImpactNFT({ client, args }: createImpactNFTProps) {
  try {
    const _args = Object.values(args);
    const txhash = await client.writeContract({
      account: client.account as Account,
      chain: client.chain,
      address: impactNftFactoryAddress,
      abi: FactoryABI,
      functionName: "createImpactNFT",
      args: [..._args],
    });
    const reciept = await publicClient.waitForTransactionReceipt({
      hash: txhash,
    });
    if (reciept.status === "reverted") {
      throw Error("Transaction reverted");
    }
  } catch (e) {
    console.error(e);
  }
}

export async function getAllCollections() {
  try {
    let collections = [];
    const nextIndex = await getNextId();
    for (let index = 0; index < nextIndex; index++) {
      const collection = await getImpactNfts({ index: index });
      collections.push(collection);
    }
    return collections;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
