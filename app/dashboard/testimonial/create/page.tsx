"use client";
import Form3 from "@/components/Form3";
import { useRouteContext } from "@/context/routeContext";
import { useEffect } from "react";

function Page() {
  const { setActivePath } = useRouteContext();
  useEffect(() => {
    setActivePath("testimonial");
  }, [setActivePath]);

  return <Form3 />;
}

export default Page;
