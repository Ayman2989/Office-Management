import mongoose, { Schema, Document, models, model, Types } from "mongoose";

export interface IEvent extends Document {
  date: Date;
  title: string;
  assignedUsers: Types.ObjectId[];
}

const EventSchema: Schema = new Schema(
  {
    date: { type: Date, required: true },
    title: { type: String, required: true, trim: true },
    assignedUsers: [
      { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    ],
  },
  { timestamps: true }
);

const Event = models.Event || model<IEvent>("Event", EventSchema);

export default Event;
