import { Schema, SchemaTypes, model } from "mongoose";

const unitSchema = new Schema(
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
