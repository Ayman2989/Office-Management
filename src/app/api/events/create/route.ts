import { connectDB } from "@/db/config";
import Event from "@/models/Event";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    await connectDB();
    const { title, date, assignedUsers } = await req.json();

    if (!title || !date || !assignedUsers?.length) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const event = await Event.create({
      title,
      date,
      assignedUsers,
    });

    return NextResponse.json({ message: "Event created", event });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
};
