"use client";

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

interface Employee {
  _id: string;
  name: string;
}

interface EventData {
  _id: string;
  title: string;
  date: string;
  assignedUsers: string[];
}

const ManageEventsPage = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({});

  // تحميل البيانات
  const fetchData = () => {
    fetch("/api/employees/get-all")
      .then((res) => res.json())
      .then((data) => setEmployees(data.employees || []));

    fetch("/api/events/get-all")
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onEdit = (event: EventData) => {
    setSelectedEvent(event);
    setSelectedDate(new Date(event.date));
    reset({
      title: event.title,
      assignedUsers: event.assignedUsers,
    });
  };

  // تحديث الحدث
  const onSubmit = async (data: any) => {
    if (!selectedEvent) return;
    try {
      const res = await fetch(`/api/events/${selectedEvent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          date: selectedDate,
        }),
      });
      const result = await res.json();
      if (!res.ok) return alert(result.error || "Failed to update event");
      alert("Event updated successfully");
      setSelectedEvent(null);
      fetchData();
    } catch (err) {
      alert("Something went wrong");
    }
  };

  // حذف الحدث
  const onDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) return alert(result.error || "Failed to delete event");
      alert("Event deleted successfully");
      // لو الحدث المحذوف هو اللي متفتح في التعديل نغلق الفورم
      if (selectedEvent?._id === id) setSelectedEvent(null);
      fetchData();
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-primary text-center">
        Manage Events
      </h1>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((ev) => (
          <div
            key={ev._id}
            className="bg-white/30 backdrop-blur-lg border border-primary/30 p-4 rounded-xl shadow space-y-2 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold text-primary">{ev.title}</h2>
              <p className="text-sm text-gray-600">
                {new Date(ev.date).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => onEdit(ev)}
                className="flex items-center gap-1 text-sm text-primary underline hover:text-secondary cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>

              <button
                onClick={() => onDelete(ev._id)}
                className="flex items-center gap-1 text-sm text-red-600 underline hover:text-red-800 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {selectedEvent && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/30 backdrop-blur-lg border border-primary/30 rounded-2xl p-6 space-y-6 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-primary text-center">
            Edit Event
          </h2>

          <div>
            <label className="block font-semibold text-primary mb-1">
              Title
            </label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className={clsx(
                "w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary",
                errors.title ? "border-red-500" : "border-primary/50"
              )}
            />
          </div>

          <div>
            <label className="block font-semibold text-primary mb-1">
              Date
            </label>
            <Calendar
              value={selectedDate}
              onChange={(date) => setSelectedDate(date as Date)}
              className="rounded-xl border border-primary shadow"
              calendarType="gregory"
              tileClassName={({ date }) =>
                clsx(
                  "rounded-xl p-3 text-lg text-center cursor-pointer",
                  selectedDate?.toDateString() === date.toDateString() &&
                    "bg-primary text-white"
                )
              }
            />
          </div>

          <div>
            <label className="block font-semibold text-primary mb-1">
              Assigned Users
            </label>
            <div className="grid grid-cols-2 gap-2">
              {employees.map((emp) => (
                <label
                  key={emp._id}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    value={emp._id}
                    {...register("assignedUsers")}
                    className="accent-primary"
                    defaultChecked={selectedEvent.assignedUsers.includes(
                      emp._id
                    )}
                  />
                  {emp.name}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-secondary transition disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Event"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ManageEventsPage;
