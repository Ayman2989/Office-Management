"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  leaveId: string;
}

export const WithdrawButton = ({ leaveId }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleWithdraw = async () => {
    const confirmed = confirm("Are you sure you want to withdraw this leave?");
    if (!confirmed) return;

    const res = await fetch(`/api/leaves/${leaveId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      startTransition(() => {
        router.refresh(); // Refresh server component
      });
    } else {
      alert("Failed to withdraw leave. It may have been approved already.");
    }
  };

  return (
    <button
      onClick={handleWithdraw}
      disabled={isPending}
      className=" cursor-pointer text-sm text-red-600 hover:bg-red-600 font-medium border border-red-300 rounded-full px-3 py-1 transition-all hover:text-white hover:border-red-600"
    >
      {isPending ? "Withdrawing..." : "Withdraw"}
    </button>
  );
};
