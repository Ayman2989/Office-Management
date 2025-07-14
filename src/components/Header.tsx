"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Header = () => {
  const [workTime, setWorkTime] = useState("6 hrs");
  const [completedShift, setCompletedShift] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string } | null>(null);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/employees/logout", {
        method: "POST",
        credentials: "include",
      });

      router.push("/login");
      console.log("Logging out...");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/employees/me");
        const data = await res.json();
        if (res.ok && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.log(error);
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-11/12  bg-white p-3 rounded-xl shadow-primary shadow-md z-50 transition-all duration-200">
      <header className="flex items-center justify-between">
        {/* LEFT SIDE — Links */}
        <nav className="flex items-center gap-3 sm:gap-6">
          {["Home", "Operations"].map((label, i) => {
            const href = i === 0 ? "/home" : "/operations";
            return (
              <Link
                key={label}
                href={href}
                className="relative group px-3 py-1 font-medium text-primary overflow-hidden rounded-md"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  {label}
                </span>
                <span className="absolute left-0 bottom-0 h-0 w-full bg-primary z-0 transition-all duration-300 group-hover:h-full"></span>
              </Link>
            );
          })}
        </nav>
        <h1 className="text-primary text-2xl font-bold">
          Welcome {currentUser?.name || "User"}
        </h1>

        {/* RIGHT SIDE — Icon + Logout */}
        <div className="flex items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2b9adb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>

          <button
            onClick={handleLogout}
            className="font-medium text-primary border-2 border-primary rounded-lg px-4 py-1 hover:bg-primary-db hover:text-white transition-all hover:bg-primary duration-300 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;
