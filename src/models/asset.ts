import { ObjectId, Schema, SchemaTypes, model } from "mongoose";

export enum AssetStatus {
  RUNNING = "Running",
  ALERTING = "Alerting",
  STOPPED = "Stopped",
}

export interface Asset {
  name: string;
  description: string;
  image: string;
  model: string;
  owner: string;
  status: AssetStatus;
  healthLevel: number;
  unit: ObjectId;
}

const assetSchema = new Schema<Asset>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: AssetStatus,
    required: true,
  },
  healthLevel: {
    type: Number,
    required: true,
  },

  unit: {
    type: SchemaTypes.ObjectId,
    ref: "Unit",
    required: true,
  },
});

export const AssetModel = model("Asset", assetSchema);
