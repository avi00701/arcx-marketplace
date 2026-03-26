"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/studio/create");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted font-medium animate-pulse">Redirecting to Creator Studio...</p>
      </div>
    </div>
  );
}
