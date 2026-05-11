import { Schema, model } from "mongoose";
import type { Types, Document } from "mongoose";
import type { TaskStatus } from "@todo/shared";

export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: false,
      transform(_doc, ret) {
        const r = ret as Record<string, unknown>;
        r["_id"] = (r["_id"] as Types.ObjectId).toString();
        delete r["__v"];
        return r;
      },
    },
  },
);

// Compound index for the primary board query and ordering
taskSchema.index({ status: 1, order: 1 });

export const TaskModel = model<ITask>("Task", taskSchema);
