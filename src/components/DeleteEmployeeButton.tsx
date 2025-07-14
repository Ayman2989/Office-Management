"use client";

import { Trash } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  employeeId: string;
  employeeName: string;
  disabled?: boolean;
}

const DeleteEmployeeButton = ({
  employeeId,
  employeeName,
  disabled,
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm(`Delete employee: ${employeeName}?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/employees/${employeeId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json();
        alert(result.error || "Failed to delete employee");
        return;
      }

      // Refresh the page
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={disabled || isPending}
      className="inline-flex pl-3 items-center gap-2 text-sm text-red-600 hover:underline disabled:opacity-60 cursor-pointer"
    >
      <Trash className="w-4 h-4" />
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeleteEmployeeButton;
