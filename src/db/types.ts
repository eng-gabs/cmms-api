import { ObjectId } from "mongoose";
import { Unit } from "../models/unit";

type KeysWithoutObjectIdArray<T> = {
  [K in keyof T]: T[K] extends ObjectId[] ? never : K;
}[keyof T];

type ObjectIdToString<T> = {
  [K in keyof T]: T[K] extends ObjectId ? string : T[K];
};

type CreateInput<T> = ObjectIdToString<Pick<T, KeysWithoutObjectIdArray<T>>>;

export type UnitCreateInput = Omit<Unit, "company"> & { companyId: string };
