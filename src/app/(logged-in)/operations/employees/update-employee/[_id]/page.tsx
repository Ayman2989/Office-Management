"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";

interface FormData {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "Manager" | "Staff";
  contactNumber: string;
}

interface UpdateEmployeePageProps {
  employeeData: FormData;
}

const UpdateEmployeePage: React.FC<UpdateEmployeePageProps> = ({
  employeeData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: employeeData,
  });
  const { _id } = useParams();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    reset(employeeData); // reset form if employeeData changes
  }, [employeeData, reset]);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`/api/employees/${_id}`);
        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Failed to load employee");
          return;
        }

        reset({
          id: data.employee._id,
          name: data.employee.name,
          email: data.employee.email,
          role: data.employee.role,
          contactNumber: data.employee.contactNumber,
        });
        setLoading(false);
      } catch (err) {
        alert("Error fetching employee data");
      }
    };

    fetchEmployee();
  }, [_id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(`/api/employees/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Failed to update employee");
        return;
      }

      alert("Employee updated successfully!");
      router.push("/operations/employees");
      // Optionally reset form or redirect
    } catch (err) {
      alert("Error submitting form");
    }
  };
  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 bg-white/30 backdrop-blur-lg rounded-3xl p-8 border border-primary/40 shadow-lg px-4 sm:px-8">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">
        Update Employee
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...register("id")} />

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-primary font-semibold mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Name is required" })}
            className={clsx(
              "w-full rounded-lg border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary",
              errors.name ? "border-red-500" : "border-primary/50"
            )}
            placeholder=""
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-primary font-semibold mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            className={clsx(
              "w-full rounded-lg border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary",
              errors.email ? "border-red-500" : "border-primary/50"
            )}
            placeholder="email@example.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Contact Number */}
        <div>
          <label
            htmlFor="contactNumber"
            className="block text-primary font-semibold mb-1"
          >
            Contact Number
          </label>
          <input
            type="tel"
            id="contactNumber"
            {...register("contactNumber", {
              required: "Contact number is required",
              minLength: { value: 5, message: "Too short" },
            })}
            className={clsx(
              "w-full rounded-lg border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary",
              errors.contactNumber ? "border-red-500" : "border-primary/50"
            )}
            placeholder="+974 1234 5678"
            disabled={isSubmitting}
          />
          {errors.contactNumber && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.contactNumber.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="block text-primary font-semibold mb-1"
          >
            Role
          </label>
          <select
            id="role"
            {...register("role", { required: "Role is required" })}
            className={clsx(
              "w-full rounded-lg border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary",
              errors.role ? "border-red-500" : "border-primary/50"
            )}
            disabled={isSubmitting}
          >
            <option value="Staff">Staff</option>
            <option value="Manager">Manager</option>
          </select>
          {errors.role && (
            <p className="text-red-500 mt-1 text-sm">{errors.role.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-primary font-semibold mb-1"
          >
            Password (leave blank to keep current)
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              minLength: { value: 6, message: "Minimum length is 6" },
            })}
            className={clsx(
              "w-full rounded-lg border border-primary/50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary",
              errors.password ? "border-red-500" : "border-primary/50"
            )}
            placeholder=""
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer bg-primary text-white py-3 rounded-xl font-semibold text-lg hover:bg-secondary transition disabled:opacity-60"
        >
          {isSubmitting ? "Updating..." : "Update Employee"}
        </button>
      </form>
    </div>
  );
};

export default UpdateEmployeePage;
