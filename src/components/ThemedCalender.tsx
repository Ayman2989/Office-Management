"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import clsx from "clsx";

interface EventItem {
  date: string;
  title: string;
}

const ThemedCalendar = ({ events }: { events: EventItem[] }) => {
  const [value, setValue] = useState<Date | null>(new Date());

  const hasEvent = (date: Date) =>
    events.some(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );

  const eventsForSelectedDate = events.filter(
    (event) =>
      value && new Date(event.date).toDateString() === value.toDateString()
  );

  return (
    <div className="flex w-full px-36 py-10 gap-10">
      {/* LEFT - Calendar Panel */}
      <div className="flex flex-col w-[480px] bg-white/30 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-primary/30">
        <Calendar
          onChange={(val) => {
            if (val instanceof Date) setValue(val);
          }}
          value={value}
          calendarType="gregory"
          className={clsx("text-primary", "react-calendar", "custom-calendar")}
          tileClassName={({ date }) =>
            clsx(
              "flex flex-col justify-center items-center rounded-xl p-3 transition-shadow duration-300 cursor-pointer text-lg",
              date.toDateString() === value?.toDateString() &&
                "bg-primary text-white scale-105 shadow-lg",
              hasEvent(date) && "border-2 border-primary",
              "hover:shadow-lg hover:bg-primary/20"
            )
          }
          navigationLabel={({ label }) => (
            <div className="mb-4 text-3xl font-extrabold text-primary text-center select-none">
              {label}
            </div>
          )}
          formatShortWeekday={(locale, date) =>
            date
              .toLocaleDateString(locale, { weekday: "short" })
              .charAt(0)
              .toUpperCase()
          }
          tileContent={({ date }) =>
            hasEvent(date) ? (
              <span className="mt-2 w-3 h-3 rounded-full bg-primary block"></span>
            ) : null
          }
        />

        {/* BELOW - Events for selected date */}
        <div className="mt-6 bg-white/60 rounded-xl p-4 shadow-inner border border-primary/10">
          <h3 className="text-lg font-semibold text-primary mb-2">
            Events on{" "}
            {value?.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </h3>
          {eventsForSelectedDate.length > 0 ? (
            <ul className="space-y-2 list-disc list-inside text-sm text-gray-800">
              {eventsForSelectedDate.map((event, index) => (
                <li key={index}>{event.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No events for this day.</p>
          )}
        </div>
      </div>

      {/* RIGHT - For News/Stocks/Whatever */}
      <div className="flex-1">{/* Plug your news or stock widgets here */}</div>

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        .custom-calendar {
          font-size: 1.1rem;
          width: 100% !important;
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
          height: 85px !important;
          max-width: 100% !important;
          margin: 0 !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }

        .custom-calendar .react-calendar__tile:focus {
          outline: none !important;
        }

        .custom-calendar .react-calendar__month-view__weekdays__weekday abbr {
          font-size: 1rem !important;
        }

        .custom-calendar .react-calendar__tile:enabled:hover {
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
};

export default ThemedCalendar;
