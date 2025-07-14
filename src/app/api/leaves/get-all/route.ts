import { connectDB } from "@/db/config";
import Leave from "@/models/Leave";
import { NextResponse } from "next/server";

connectDB();

export async function GET() {
  try {
    await connectDB();
    const leaves = await Leave.find().populate("employee", "name"); //  include only needed fields

    return NextResponse.json({
      status: 200,
      leaves,
    });
  } catch (error) {
    console.error("Failed to fetch leaves:", error);
    return NextResponse.json({
      status: 500,
      error: "Failed to fetch leaves",
    });
  }
}
