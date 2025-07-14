"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const ManageLeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await fetch("/api/leaves/get-all");
      const data = await res.json();
      if (res.ok) {
        const sorted: any = [...data.leaves].sort((a, b) =>
          a.status === "Pending" && b.status !== "Pending" ? -1 : 1
        );
        setLeaves(sorted);
      } else {
        toast.error("Failed to fetch leaves");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    _id: string,
    action: "Approved" | "Rejected"
  ) => {
    try {
      setUpdatingId(_id);
      const res = await fetch(`/api/leaves/${_id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Leave ${action.toLowerCase()}`);
      fetchLeaves();
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setUpdatingId(null);
    }
  };
  console.log(leaves);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Manage Staff Leaves
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-8 h-8 text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {leaves.map((leave: any) => (
            <div
              key={leave._id}
              className="p-5 bg-white/40 backdrop-blur-md rounded-2xl border border-primary/20 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              {/* Left side - Employee & reason */}
              <div className="space-y-1">
                <p className="font-semibold text-gray-900 text-lg">
                  {leave.employee.name} -{" "}
                  <span className="text-primary">{leave.reason}</span>
                </p>
                <p className="text-sm text-gray-700">
                  {new Date(leave.startDate).toLocaleDateString() ===
                  new Date(leave.endDate).toLocaleDateString()
                    ? `On ${new Date(leave.startDate).toLocaleDateString()}`
                    : `From ${new Date(
                        leave.startDate
                      ).toLocaleDateString()} To ${new Date(
                        leave.endDate
                      ).toLocaleDateString()}`}
                </p>
              </div>

              {/* Right side - Status + Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Status Badge */}
                {leave.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(leave._id, "Approved")}
                      disabled={updatingId === leave._id}
                      className="px-4 py-1.5 text-sm font-medium bg-green-500 cursor-pointer  text-white hover:bg-green-700 rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(leave._id, "Rejected")}
                      disabled={updatingId === leave._id}
                      className=" cursor-pointer px-4 py-1.5 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                )}
                <span
                  className={clsx(
                    "text-sm font-medium px-4 py-1.5 rounded-full border shadow-sm",
                    leave.status === "Approved" &&
                      "bg-green-100 text-green-700 border-green-300",
                    leave.status === "Rejected" &&
                      "bg-red-100 text-red-600 border-red-300",
                    leave.status === "Pending" &&
                      "bg-yellow-100 text-yellow-800 border-yellow-300"
                  )}
                >
                  {leave.status}
                </span>

                {/* Action buttons for pending */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageLeavePage;
