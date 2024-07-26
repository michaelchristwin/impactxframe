"use client";
import { getAllCollections } from "@/actions/collections";
import CollectionCard from "@/components/ColectionCard";
import { useRouteContext } from "@/context/routeContext";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Address } from "viem";

function Page() {
  const { setActivePath } = useRouteContext();
  useEffect(() => {
    setActivePath("mint");
  }, [setActivePath]);
  const { error, data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: () => getAllCollections().then((res) => res),
  });
  if (error) return "An error has occurred: " + error.message;
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-3 w-full h-[100vh] p-[20px]">
      {collections &&
        collections.map((item, index) => (
          <CollectionCard key={index} address={item as Address} />
        ))}
    </div>
  );
}

export default Page;
