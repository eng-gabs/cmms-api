import { Schema, SchemaTypes, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    company: {
      type: SchemaTypes.ObjectId,
      ref: "Company",
      required: false,
    },
  },
  { timestamps: true }
);

export const UserModel = model("User", userSchema);
