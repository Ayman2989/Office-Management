import mongoose, { Schema, Document, model, models, Types } from "mongoose";

export interface ILeave extends Document {
  employee: Types.ObjectId;
  reason: string;
  startDate: Date;
  endDate: Date;
  status: "Pending" | "Approved" | "Rejected";
  managerComments?: string;
  notify: boolean;
}

const LeaveSchema = new Schema<ILeave>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    managerComments: {
      type: String,
      trim: true,
      default: "",
    },
    notify: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

// Optional: Validation to make sure endDate is not before startDate
LeaveSchema.pre("save", function (next) {
  if (this.endDate < this.startDate) {
    return next(new Error("End date cannot be before start date."));
  }
  next();
});

const Leave = models.Leave || model<ILeave>("Leave", LeaveSchema);

export default Leave;
