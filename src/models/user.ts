import {
  Schema,
  SchemaTypes,
  model,
  Document,
  Model,
  ObjectId,
} from "mongoose";

// Interface for documents,
export interface User extends Document {
  name: string;
  email: string;
  company?: ObjectId;
}

const userSchema: Schema<User> = new Schema(
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

// Interface for collections strong typing to IUser
interface UserModel extends Model<User> {
  save(user: string): string;
}

export const UserModel = model<User, UserModel>("User", userSchema);
