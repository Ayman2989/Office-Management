import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      _id: string;
      email: string;
      role: string;
      name: string;
    };
    return NextResponse.json({
      user: {
        _id: decoded._id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
      },
    });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
