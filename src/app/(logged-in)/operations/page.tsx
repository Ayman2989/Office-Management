import React from "react";
import ServiceCard from "@/components/ServiceCard";
import { getCurrentUser } from "@/lib/getCurrentUser";

const Operationspage = async () => {
  const currentUser = await getCurrentUser();
  return (
    <div className="min-h-screen pt-12 px-4 flex justify-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center">
          Operations
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-items-center">
          <ServiceCard
            title="Leaves"
            href="/operations/leaves"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 12h-5"></path>
                <path d="M15 8h-5"></path>
                <path d="M19 17V5a2 2 0 0 0-2-2H4"></path>
                <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"></path>
              </svg>
            }
          />
          {currentUser?.role === "Manager" && (
            <ServiceCard
              title="Employees"
              href="/operations/employees"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M4 21v-2a4 4 0 0 1 3-3.87"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              }
            />
          )}
          <ServiceCard
            title="Events"
            href="/operations/events"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <path d="M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"></path>
                <path d="M3 10h18"></path>
                <path d="m16 20 2 2 4-4"></path>
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Operationspage;
