import { Document, ObjectId, Schema, SchemaTypes, model } from "mongoose";

export interface Company extends Document {
  name: string;
  users: ObjectId[];
  units: ObjectId[];
}

const companySchema = new Schema<Company>(
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
