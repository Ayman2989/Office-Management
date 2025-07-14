import { NextRequest, NextResponse } from "next/server";

import Leave from "@/models/Leave";
// your JWT user extractor
import { connectDB } from "@/db/config";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: NextRequest) {
  try {
    // Connect to DB
    await connectDB();

    // Get current user info from token cookie
    const user = await getCurrentUser();
    if (!user?._id) {
      return NextResponse.json(
        { error: "Unauthorized, no user found" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate required fields
    const { startDate, endDate, reason } = body;
    if (!startDate || !endDate || !reason) {
      return NextResponse.json(
        { error: "startDate, endDate and reason are required" },
        { status: 400 }
      );
    }

    // Convert dates to Date objects and validate
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (end < start) {
      return NextResponse.json(
        { error: "endDate cannot be before startDate" },
        { status: 400 }
      );
    }

    // Create leave request
    const leaveRequest = await Leave.create({
      employee: user._id,
      reason,
      startDate: start,
      endDate: end,
      status: user.role === "Manager" ? "Approved" : "Pending",
      notify: true, // Assuming you want to notify by default
    });

    return NextResponse.json({
      message: "Leave request submitted",
      leaveRequest,
    });
  } catch (error) {
    console.error("Leave request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
