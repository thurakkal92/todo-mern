import { Schema, model } from "mongoose";
import type { Types, Document } from "mongoose";

export interface ITeam extends Document {
  _id: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
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

export const TeamModel = model<ITeam>("Team", teamSchema);
