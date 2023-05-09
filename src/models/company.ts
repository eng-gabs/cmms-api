import { Document, Schema, SchemaTypes, model } from "mongoose";

export interface Company extends Document {
  name: string;
  users: string[];
  units: string[];
}

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    users: {
      type: [SchemaTypes.ObjectId],
      ref: "User",
      required: true,
    },
    units: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Unit",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

export const CompanyModel = model("Company", companySchema);
