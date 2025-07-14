import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/config";
import Employee from "@/models/Employee";
import bcrypt from "bcryptjs";

connectDB();

export async function GET(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  const { _id } = params;

  if (!_id) {
    return NextResponse.json({ error: "Missing Employee ID" }, { status: 400 });
  }

  try {
    const employee = await Employee.findById(_id);

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ employee }, { status: 200 });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
    return NextResponse.json({ error: "Missing Employee ID" }, { status: 400 });
  }

  try {
    const deleted = await Employee.findByIdAndDelete(_id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  const { _id } = params;

  if (!_id) {
    return NextResponse.json({ error: "Missing Employee ID" }, { status: 400 });
  }

  try {
    const body = await req.json();

    const { name, email, password, role, contactNumber } = body;

    const updateData: any = {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      ...(contactNumber && { contactNumber }),
    };

    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await Employee.findByIdAndUpdate(_id, updateData, {
      new: true,
    })
      .select("-password")
      .lean();

    if (!updated) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Employee updated",
      employee: updated,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}
