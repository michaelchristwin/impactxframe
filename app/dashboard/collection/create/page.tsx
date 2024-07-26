"use client";
import CreateCollection from "@/components/CreateCollection";
import { useRouteContext } from "@/context/routeContext";
import { useEffect } from "react";

function Page() {
  const { setActivePath } = useRouteContext();
  useEffect(() => {
    setActivePath("create");
  }, [setActivePath]);

  return <CreateCollection />;
}

export default Page;
