import { connectDB } from "@/db/config";
import Leave from "@/models/Leave";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function PUT(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  try {
    const { status } = await req.json();

    if (!["Approved", "Rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const leave = await Leave.findById(params._id);
    if (!leave) {
      return NextResponse.json({ error: "Leave not found" }, { status: 404 });
    }

    leave.status = status;
    await leave.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error updating leave:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
