import { Router } from "express";
import { unitController } from "../controllers/unitController";
import { assetControler } from "../controllers/assetControler";
import { Unit } from "../models/unit";
export const unitRouter = Router();

unitRouter.route("/").post<{}, Unit, Unit>(async (req, res) => {
  await unitController.create(req, res);
});

unitRouter.route("/:id").get(async (req, res) => {
  await unitController.get(req, res);
});

unitRouter.route("/:id").patch(async (req, res) => {
  await unitController.update(req, res);
});

unitRouter.route("/:id").delete(async (req, res) => {
  await unitController.delete(req, res);
});

unitRouter.route("/").get(async (req, res) => {
  await unitController.list(req, res);
});
