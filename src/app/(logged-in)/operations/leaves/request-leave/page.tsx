"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import clsx from "clsx";
import { useRouter } from "next/navigation";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const LeaveRequestPage = () => {
  const [leaveType, setLeaveType] = useState<"one-day" | "multi-day">(
    "one-day"
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [range, setRange] = useState<[Date | null, Date | null] | null>(null);

  const [reason, setReason] = useState("");
  const router = useRouter();

  const handleCalendarChange = (
    val: Value,
    _event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (leaveType === "multi-day" && Array.isArray(val)) {
      setRange(val);
    } else if (!Array.isArray(val) && val instanceof Date) {
      setSelectedDate(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload =
      leaveType === "one-day"
        ? {
            startDate: selectedDate,
            endDate: selectedDate,
            reason,
          }
        : {
            startDate: range?.[0],
            endDate: range?.[1],
            reason,
          };
    console.log("Submitting leave request:", payload);
    try {
      const res = await fetch("/api/leaves/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(
          `Failed to submit leave request: ${data.error || "Unknown error"}`
        );
        console.error("Error response:", data);
        return;
      }

      router.push("/operations/leaves");
      // Optionally reset form here:
      // setSelectedDate(new Date());
      // setRange(null);
      // setReason("");
    } catch (error) {
      alert("An error occurred while submitting leave request.");
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="w-full p-2   flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl w-full bg-white/30 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-primary/30"
      >
        <h1 className="text-3xl font-bold text-primary mb-6">Leave Request</h1>

        {/* Leave Type Toggle */}
        <div className="mb-6">
          <label className="text-lg font-medium text-gray-800 mr-4">
            Leave Type:
          </label>
          <button
            type="button"
            onClick={() => setLeaveType("one-day")}
            className={clsx(
              "px-4 py-2 rounded-l-lg",
              leaveType === "one-day"
                ? "bg-primary text-white"
                : "bg-white text-primary border border-primary"
            )}
          >
            One Day
          </button>
          <button
            type="button"
            onClick={() => setLeaveType("multi-day")}
            className={clsx(
              "px-4 py-2 rounded-r-lg",
              leaveType === "multi-day"
                ? "bg-primary text-white"
                : "bg-white text-primary border border-primary"
            )}
          >
            Multiple Days
          </button>
        </div>

        {/* Calendar Picker */}
        <div className="mb-6">
          <Calendar
            onChange={handleCalendarChange}
            value={leaveType === "multi-day" ? range : selectedDate}
            selectRange={leaveType === "multi-day"}
            calendarType="gregory"
            className={clsx(
              "text-primary",
              "react-calendar",
              "custom-calendar"
            )}
            tileClassName={({ date }) =>
              clsx(
                "rounded-xl p-3 text-lg text-center cursor-pointer",
                leaveType === "one-day" &&
                  selectedDate?.toDateString() === date.toDateString() &&
                  "bg-primary text-white",
                leaveType === "multi-day" &&
                  range?.[0] &&
                  range?.[1] &&
                  date >= range[0] &&
                  date <= range[1] &&
                  "bg-primary text-white"
              )
            }
          />
        </div>

        {/* Reason Input */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800 mb-2">
            Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            required
            className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-secondary transition-all cursor-pointer"
          >
            Submit Leave Request
          </button>
        </div>
        <style jsx global>{`
          .custom-calendar {
            font-size: 1.1rem;
            width: 100%;
          }

          .react-calendar {
            border: none !important;
          }

          .custom-calendar .react-calendar__month-view__days {
            display: grid !important;
            grid-template-columns: repeat(7, 1fr) !important;
            gap: 8px;
          }

          .custom-calendar .react-calendar__tile {
            height: 50px !important;
            max-width: 100% !important;
            border: none !important;
          }
        `}</style>
      </form>
    </div>
  );
};

export default LeaveRequestPage;
