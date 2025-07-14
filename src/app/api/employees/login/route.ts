import { connectDB } from "@/db/config";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Employee from "@/models/Employee";

connectDB();

const JWT_SECRET = process.env.JWT_SECRET!;

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        _id: employee._id,
        email: employee.email,
        role: employee.role,
        name: employee.name,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
    return NextResponse.json({
      message: "Login successful",
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to login",
      },
      { status: 500 }
    );
  }
};
