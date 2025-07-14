// /api/events/[id]/route.ts

import { connectDB } from "@/db/config";
import Event from "@/models/Event";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { _id: string } }
) {
  await connectDB();

  try {
    const { _id } = params;
    const { title, date, assignedUsers } = await req.json();

    if (!title || !date || !Array.isArray(assignedUsers)) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    const updated = await Event.findByIdAndUpdate(
      _id,
      {
        title,
        date,
        assignedUsers,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Event updated", event: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  const { _id } = params;

  if (!_id) {
    return NextResponse.json({ error: "Missing Event ID" }, { status: 400 });
  }

  try {
    const deleted = await Event.findByIdAndDelete(_id);

    if (!deleted) {
      return NextResponse.json({ error: "eevnrt not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    return NextResponse.json({
      error: "internal server error",
    });
  }
}
