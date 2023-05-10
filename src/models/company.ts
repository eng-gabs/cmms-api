import { Document, ObjectId, Schema, SchemaTypes, model } from "mongoose";

// export interface Company extends Document {
//   name: string;
//   users: ObjectId[];
//   units: ObjectId[];
// }

export interface Company {
  name: string;
  users: ObjectId[];
  units: ObjectId[];
}

export type CompanyDoc = Document<Company>;

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
