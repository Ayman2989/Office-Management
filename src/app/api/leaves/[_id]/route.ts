// /app/api/leaves/[id]/route.ts
import { connectDB } from "@/db/config";
import Leave from "@/models/Leave";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  const user = await getCurrentUser(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leave = await Leave.findById(params._id);

  if (!leave) {
    return NextResponse.json({ error: "Leave not found" }, { status: 404 });
  }

  if (leave.employee.toString() !== user._id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (leave.status !== "Pending") {
    return NextResponse.json(
      { error: "Leave already processed by manager" },
      { status: 400 }
    );
  }

  await Leave.findByIdAndDelete(params._id);

  return NextResponse.json({ message: "Leave withdrawn successfully" });
}
