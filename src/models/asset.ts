import { Schema, SchemaTypes, model } from "mongoose";

enum AssetStatus {
  RUNNING = "Running",
  ALERTING = "Alerting",
  STOPPED = "Stopped",
}

const assetSchema = new Schema({
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
