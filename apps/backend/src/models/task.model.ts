import { Schema, model } from "mongoose";
import type { Types, Document } from "mongoose";
import type { TaskStatus } from "@todo/shared";

export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  order: number;
  projectId?: Types.ObjectId;
  dueDate?: Date;
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
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: false,
      transform(_doc, ret) {
        const r = ret as Record<string, unknown>;
        r["_id"] = (r["_id"] as Types.ObjectId).toString();
        if (r["projectId"]) {
          r["projectId"] = (r["projectId"] as Types.ObjectId).toString();
        }
        delete r["__v"];
        return r;
      },
    },
  },
);

// Primary board query: tasks within a project per column
taskSchema.index({ projectId: 1, status: 1, order: 1 });
// Home view: all tasks across projects
taskSchema.index({ status: 1, order: 1 });

export const TaskModel = model<ITask>("Task", taskSchema);
