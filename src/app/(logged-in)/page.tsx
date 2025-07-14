"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoggedInHome() {
  const router = useRouter();

  useEffect(() => {
    router.push("/home");
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p>Redirecting...</p>
    </div>
  );
}
