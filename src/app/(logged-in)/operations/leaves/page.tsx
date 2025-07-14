import Link from "next/link";
import React from "react";
import { CalendarDays, FileText, Users } from "lucide-react";
import clsx from "clsx";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectDB } from "@/db/config";
import Leave from "@/models/Leave";
import { WithdrawButton } from "@/components/WithdrawButton";

const LeavesPage = async () => {
  const currentUser = await getCurrentUser();
  console.log("Current User:", currentUser);

  await connectDB();

  if (!currentUser)
    return <div className="text-center mt-10">Not authorized</div>;

  const myLeaves = await Leave.find({ employee: currentUser._id }).populate(
    "employee",
    "name"
  );

  let pendingCount = 0;

  if (currentUser.role === "Manager") {
    pendingCount = await Leave.countDocuments({ status: "Pending" });
  }
  console.log("My Leaves:", myLeaves);

  return (
    <div className="w-full px-4 py-8 max-w-6xl mx-auto space-y-10">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-primary text-center">
        Leave Management
      </h1>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/operations/leaves/request-leave">
          <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl border border-primary/30 shadow-xl hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-4">
            <CalendarDays className="text-primary w-10 h-10" />
            <div>
              <h2 className="text-xl font-semibold text-primary">
                Request Leave
              </h2>
              <p className="text-gray-700 text-sm">
                Submit a new leave request
              </p>
            </div>
          </div>
        </Link>
        {currentUser.role == "Manager" && (
          <Link href="/operations/leaves/manage-staff-leave">
            <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl border border-primary/30 shadow-xl hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-4">
              <Users className="text-primary w-10 h-10" />
              <div>
                <h2 className="text-xl font-semibold text-primary">
                  Manage Staff Leaves
                </h2>
                <p className="text-gray-700 text-sm">
                  View & approve/reject staff leaves
                </p>
                {pendingCount > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                )}
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* My Leaves Section */}
      <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl border border-primary/30 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="text-primary" />
          <h2 className="text-xl font-bold text-primary">My Leaves</h2>
        </div>
        <div className="space-y-4">
          {myLeaves.map((leave) => (
            <div
              key={leave._id.toString()}
              className="p-4 rounded-xl bg-white/40 border border-primary/20 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-gray-800 font-medium">{leave.reason}</p>

                <p className="text-sm text-gray-600">
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
              <div className="flex items-center gap-3">
                {leave.status === "Pending" && (
                  <WithdrawButton leaveId={leave._id.toString()} />
                )}
                <span
                  className={clsx(
                    "px-3 py-1 rounded-full text-sm font-semibold",
                    leave.status === "Approved"
                      ? "bg-green-100 text-green-600"
                      : leave.status === "Rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-700"
                  )}
                >
                  {leave.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeavesPage;
