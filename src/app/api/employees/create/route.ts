import { connectDB } from "@/db/config";
import Employee from "@/models/Employee";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connectDB();

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const { name, email, password, role, contactNumber } = await request.json();

    if (!name || !email || !password || !role || !contactNumber) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }
    const existingEmployee = await Employee.find({ email });
    if (existingEmployee.length > 0) {
      return NextResponse.json(
        { error: "Employee with this email already exists." },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployee = await Employee.create({
      name,
      email,
      password: hashedPassword,
      role,
      contactNumber,
    });
    return NextResponse.json(
      { message: "Employee created successfully", employee: newEmployee },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to connect to the database or process the request.",
      },
      { status: 500 }
    );
  }
};
