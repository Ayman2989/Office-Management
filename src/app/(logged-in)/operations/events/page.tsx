import React from "react";
import Link from "next/link";
import { CalendarPlus, Pencil } from "lucide-react";
import { connectDB } from "@/db/config";
import Event from "@/models/Event";
import { getCurrentUser } from "@/lib/getCurrentUser";

export const dynamic = "force-dynamic";

const EventsPage = async () => {
  try {
    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return <div className="text-center mt-10 text-red-500">Unauthorized</div>;
    }

    const events = await Event.find(
      user.role === "Manager" ? {} : { assignedUsers: user._id }
    ).populate("assignedUsers");

    const today = new Date();
    const upcomingEvents = events.filter((e: any) => new Date(e.date) >= today);
    const finishedEvents = events.filter((e: any) => new Date(e.date) < today);

    return (
      <div className="w-full px-4 py-8 max-w-6xl mx-auto space-y-10">
        {/* Heading & Add Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Events</h1>
          {user.role === "Manager" && (
            <div className="flex gap-4">
              <Link
                href="/operations/events/add-event"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-secondary transition-all"
              >
                <CalendarPlus className="w-4 h-4" />
                Add Event
              </Link>
              <Link
                href="/operations/events/manage-events"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white transition-all"
              >
                <Pencil className="w-4 h-4" />
                Manage Events
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <section>
          <h2 className="text-xl font-semibold text-primary mb-4">
            Upcoming Events
          </h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event: any) => (
                <div
                  key={event._id.toString()}
                  className="bg-white/30 backdrop-blur-lg border border-primary/30 p-6 rounded-2xl shadow-xl space-y-3"
                >
                  <p className="text-xl font-semibold text-primary">
                    {event.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    On{" "}
                    {new Date(event.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No upcoming events.</p>
          )}
        </section>

        {/* Finished Events */}
        <section>
          <h2 className="text-xl font-semibold text-primary mb-4">
            Finished Events
          </h2>
          {finishedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {finishedEvents.map((event: any) => (
                <div
                  key={event._id.toString()}
                  className="bg-white/20 backdrop-blur border border-gray-300 p-6 rounded-2xl shadow space-y-3 opacity-70"
                >
                  <p className="text-xl font-semibold text-gray-700">
                    {event.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Held on{" "}
                    {new Date(event.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No finished events yet.</p>
          )}
        </section>
      </div>
    );
  } catch (error) {
    console.error("Server error in EventsPage:", error);
    return (
      <div className="text-center mt-10 text-red-500">
        Server Error. Please try again later.
      </div>
    );
  }
};

export default EventsPage;
