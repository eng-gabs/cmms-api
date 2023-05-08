import { Schema, SchemaTypes, model } from "mongoose";

const unitSchema = new Schema(
  {
    company: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const UnitModel = model("Unit", unitSchema);
