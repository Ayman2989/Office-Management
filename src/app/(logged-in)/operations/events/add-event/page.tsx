"use client";

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface Employee {
  _id: string;
  name: string;
}

interface EventForm {
  title: string;
  date: Date;
  assignedUsers: string[];
}

const AddEventPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<EventForm>();

  useEffect(() => {
    fetch("/api/employees/get-all")
      .then((res) => res.json())
      .then((data) => setEmployees(data.employees || []))
      .catch(() => setEmployees([]));
  }, []);

  const onSubmit = async (data: EventForm) => {
    try {
      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, date: selectedDate }),
      });

      const result = await res.json();
      if (!res.ok) return alert(result.error || "Failed to create event");
      alert("Event created successfully!");
      router.push("/operations/events");
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="w-full p-2 flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl w-full bg-white/30 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-primary/30"
      >
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">
          Add New Event
        </h1>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800 mb-2">
            Event Title
          </label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            placeholder=""
            className={clsx(
              "w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary",
              errors.title ? "border-red-500" : "border-primary/50"
            )}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Calendar */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800 mb-2">
            Select Date
          </label>
          <Calendar
            onChange={(date) => setSelectedDate(date as Date)}
            value={selectedDate}
            minDate={new Date()}
            calendarType="gregory"
            className={clsx(
              "text-primary",
              "react-calendar",
              "custom-calendar"
            )}
            tileClassName={({ date }) =>
              clsx(
                "rounded-xl p-3 text-lg text-center cursor-pointer",
                selectedDate?.toDateString() === date.toDateString() &&
                  "bg-primary text-white"
              )
            }
          />
        </div>

        {/* Assigned Users */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800 mb-2">
            Assign Employees
          </label>
          <div className="grid grid-cols-9 gap-2">
            {employees.map((emp) => (
              <label key={emp._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={emp._id}
                  {...register("assignedUsers", { required: true })}
                  className="accent-primary"
                />
                <span className="text-sm text-gray-700">{emp.name}</span>
              </label>
            ))}
          </div>
          {errors.assignedUsers && (
            <p className="text-sm text-red-500 mt-1">
              Please assign at least one employee.
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-secondary transition-all cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create Event"}
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

export default AddEventPage;
