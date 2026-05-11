import { Schema, model } from "mongoose";
import type { Types, Document } from "mongoose";

export interface IProject extends Document {
  _id: Types.ObjectId;
  name: string;
  teamId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Team",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: false,
      transform(_doc, ret) {
        const r = ret as Record<string, unknown>;
        r["_id"] = (r["_id"] as Types.ObjectId).toString();
        r["teamId"] = (r["teamId"] as Types.ObjectId).toString();
        delete r["__v"];
        return r;
      },
    },
  },
);

projectSchema.index({ teamId: 1 });

export const ProjectModel = model<IProject>("Project", projectSchema);
