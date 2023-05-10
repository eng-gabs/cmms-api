import { ObjectId, Schema, SchemaTypes, model } from "mongoose";

export interface Unit {
  name: string;
  company: ObjectId;
  assets: ObjectId[];
}

const unitSchema = new Schema<Unit>(
  {
    company: {
      type: SchemaTypes.ObjectId,
      ref: "Company",
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    assets: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Asset",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

export const UnitModel = model("Unit", unitSchema);
