"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setServerError("");

    try {
      const res = await fetch("/api/employees/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Login failed");
      } else {
        router.push("/home");
      }
    } catch (error) {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Translucent Background Blur Layer */}
      <div className="absolute inset-0 bg-primary/10 backdrop-blur-2xl z-0" />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/80 shadow-2xl backdrop-blur-lg p-8 border border-white/30">
        <h2 className="text-3xl font-bold text-center text-primary mb-8 drop-shadow-md">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <p className="text-sm text-red-600 font-medium">{serverError}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-secondary text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
