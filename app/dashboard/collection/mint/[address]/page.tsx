"use client";

import { useRouteContext } from "@/context/routeContext";
import { useEffect, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import NFTABI from "@/ABIs/Proxycontract.json";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { useReadContract, useAccount } from "wagmi";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { config } from "@/config/wagmi";
import Image from "next/image";
import { Address } from "viem";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import toast from "react-hot-toast";
import { sepolia } from "viem/chains";
import { useQuery } from "@tanstack/react-query";

const loadingStates = [
  {
    text: "Executing mint transaction...",
  },
  {
    text: "Confirming mint transaction...",
  },
];

function Page({ params }: { params: { address: string } }) {
  const { setActivePath } = useRouteContext();
  useEffect(() => {
    setActivePath("mint");
  }, [setActivePath]);
  const [quantity, setQuantity] = useState(0);
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [txState, setTxState] = useState(0);
  const { data: tokenURI } = useReadContract({
    address: params.address as Address,
    abi: NFTABI,
    functionName: "tokenURI",
    args: [BigInt(0)],
    chainId: sepolia.id,
  });

  const {
    isPending,
    error,
    data: tokenData,
  } = useQuery({
    queryKey: ["tokenData"],
    queryFn: () => fetch(tokenURI as string).then((res) => res.json()),
    enabled: !!tokenURI,
  });

  const { data: price } = useReadContract({
    address: params.address as Address,
    abi: NFTABI,
    functionName: "_unitPrice",
  });
  const handleClick = async () => {
    try {
      console.log("Price: ", price);
      console.log("Quantity: ", quantity);
      setLoading(true);
      setTxState(0);
      if (typeof price !== "bigint" || typeof address === "undefined") {
        throw Error("Price or address is invalid");
      }
      const value = BigInt(BigInt(quantity) * price);
      console.log(value);
      const mintTxHash = await writeContract(config, {
        abi: NFTABI,
        address: params.address as Address,
        functionName: "mintBatch",
        value: value,
        args: [BigInt(quantity)],
      });

      setTxState(1);
      const mintReciept = await waitForTransactionReceipt(config, {
        hash: mintTxHash,
      });
      setLoading(false);
      toast.success("Mint successfull");
      if (mintReciept.status === "reverted") {
        throw Error("Mint transaction reverted");
      }
    } catch (e) {
      setLoading(false);
      toast.error("Transaction failed");
      console.error(e);
    }
  };
  if (error) return "An error has occurred: " + error.message;
  return (
    <div
      className={`w-full flex text-center justify-center h-[100vh] items-center p-[15px]`}
    >
      <div
        className={`flex justify-center items-center w-[80%] shadow-2xl h-full`}
      >
        <fieldset className={`w-[100%] space-y-4`}>
          <div
            className={`relative flex mx-auto items-center justify-center lg:w-[400px] lg:h-[400px] 2xl:h-[400px] 2xl:w-[400px] xl:h-[400px] xl:w-[400px] md:h-[400px] md:w-[400px] h-[300px] w-[300px] rounded-[15px] ${
              !tokenData?.image && "border"
            }`}
          >
            {!isPending && (
              <Image alt="collection-image" src={tokenData.image} fill />
            )}
          </div>
          <p className={`text-[16px] font-medium`}>Select the quantity</p>
          <div
            className={`flex w-[50%] mx-auto space-x-3 justify-center items-center`}
          >
            <button
              className={`w-[50px] bg-indigo-500 h-[40px] rounded-[5px]`}
              type="button"
              onClick={() => setQuantity((p) => p - 1)}
              disabled={quantity === 0}
            >
              <RemoveRoundedIcon className="text-white" />
            </button>
            <div
              className={`w-[40%] flex justify-center items-center h-[50px] border-[0.5px] rounded-[5px] text-center`}
            >
              {quantity}
            </div>
            <button
              className={`w-[50px] bg-indigo-500 h-[40px] rounded-[5px]`}
              type="button"
              onClick={() => setQuantity((p) => p + 1)}
            >
              <AddRoundedIcon className="text-white" />
            </button>
          </div>
          <button
            disabled={quantity <= 0}
            onClick={handleClick}
            className={`w-[70px] disabled:opacity-[0.5] active:opacity-[0.5] hover:opacity-[0.6] bg-black block mx-auto h-[40px] rounded-lg shadow-xl text-white`}
            type="button"
          >
            Mint
          </button>
        </fieldset>
      </div>
      <MultiStepLoader
        loadingStates={loadingStates}
        currentState={txState}
        loading={loading}
      />
    </div>
  );
}

export default Page;
