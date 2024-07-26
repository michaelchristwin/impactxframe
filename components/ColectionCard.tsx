"use client";

import { useReadContract } from "wagmi";
import Image from "next/image";
import { Address } from "viem";
import NFTABI from "@/ABIs/Proxycontract.json";
import { useEffect, useState } from "react";
import Link from "next/link";
import { sepolia } from "viem/chains";

const frontendHost = process.env.NEXT_PUBLIC_FRONTEND;
export interface ColMetadata {
  title: string;
  description: string;
  image: string;
}

function CollectionCard({ address }: { address: Address }) {
  const [data, setData] = useState<ColMetadata | undefined>(undefined);
  const { data: tokenURI } = useReadContract({
    address: address,
    abi: NFTABI,
    functionName: "tokenURI",
    args: [BigInt(0)],
    chainId: sepolia.id,
  });

  useEffect(() => {
    if (typeof tokenURI === "string") {
      (async () => {
        try {
          const res = await fetch(tokenURI);

          const data = await res.json();
          setData(data);
        } catch (e) {
          console.error("Fetch error:", e);
        }
      })();
    }
  }, [tokenURI]);
  return (
    <Link
      className={`h-[350px] w-[350px]`}
      href={`${frontendHost}/dashboard/collection/mint/${address}`}
    >
      <div className={`relative h-full w-full cursor-pointer`}>
        {data && <Image alt="collection-image" src={data.image} fill />}
      </div>
    </Link>
  );
}

export default CollectionCard;
