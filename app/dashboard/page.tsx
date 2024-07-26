"use client";
import { useRouteContext } from "@/context/routeContext";
import { useEffect } from "react";

function Page() {
  const { setActivePath } = useRouteContext();
  useEffect(() => {
    setActivePath("home");
  }, [setActivePath]);

  return <div></div>;
}

export default Page;
