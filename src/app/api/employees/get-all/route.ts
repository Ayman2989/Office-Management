import { connectDB } from "@/db/config";
import Employee from "@/models/Employee";
import { NextResponse } from "next/server";

export const GET = async () => {
  await connectDB();
  const employees = await Employee.find().select("_id name");
  return NextResponse.json({ employees });
};
