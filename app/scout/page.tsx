"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ScoutRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/scouts");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}
