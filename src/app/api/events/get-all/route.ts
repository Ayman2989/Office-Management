import { connectDB } from "@/db/config";
import Event from "@/models/Event";

import { NextResponse } from "next/server";

export const GET = async () => {
  await connectDB();
  const events = await Event.find();
  return NextResponse.json({ events });
};
