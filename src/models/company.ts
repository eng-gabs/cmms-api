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
  },
  { timestamps: true }
);

export const CompanyModel = model("Company", companySchema);
