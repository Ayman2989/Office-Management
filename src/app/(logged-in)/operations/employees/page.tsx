import React from "react";
import Link from "next/link";
import { Plus, Pencil, Trash } from "lucide-react";
import { connectDB } from "@/db/config";
import Employee from "@/models/Employee";
import { getCurrentUser } from "@/lib/getCurrentUser";
import clsx from "clsx";
import DeleteEmployeeButton from "@/components/DeleteEmployeeButton";

const EmployeesPage = async () => {
  await connectDB();
  const user = await getCurrentUser();

  if (!user || user.role !== "Manager") {
    return <div className="text-center mt-10 text-red-500">Unauthorized</div>;
  }

  const employees = await Employee.find();

  return (
    <div className="w-full px-4 py-8 max-w-6xl mx-auto space-y-10">
      {/* Heading & Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Employees</h1>
        <Link
          href="/operations/employees/create-employee"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-secondary transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </Link>
      </div>

      {/* Employee List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {employees.map((employee: any) => {
          const isCurrentUser = user._id.toString() === employee._id.toString();
          return (
            <div
              key={employee._id.toString()}
              className="bg-white/30 backdrop-blur-lg border border-primary/30 p-6 rounded-2xl shadow-xl space-y-3"
            >
              <div>
                <p className="text-xl font-semibold text-primary">
                  {employee.name}
                </p>
                <p className="text-sm text-gray-600">{employee.email}</p>
                <p
                  className={clsx(
                    "inline-block mt-1 text-xs px-2 py-1 rounded-full",
                    employee.role === "Manager"
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-yellow-100 text-yellow-700"
                  )}
                >
                  {employee.role}
                </p>
              </div>
              <Link
                href={`/operations/employees/update-employee/${employee._id}`}
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Pencil className="w-4 h-4" />
                Update
              </Link>
              {!isCurrentUser && (
                <DeleteEmployeeButton
                  employeeId={employee._id.toString()}
                  employeeName={employee.name}
                  disabled={isCurrentUser}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeesPage;
