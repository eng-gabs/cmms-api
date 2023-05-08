import { Schema, SchemaTypes, model } from "mongoose";

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
