import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  role: "Manager" | "Staff";
  email: string;
  password: string;
  contactNumber: string;
}

const EmployeeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Manager", "Staff"],
      default: "staff",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Prevent model overwrite in dev
const Employee =
  models.Employee || model<IEmployee>("Employee", EmployeeSchema);

export default Employee;
