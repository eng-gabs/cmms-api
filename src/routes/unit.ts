import { Router } from "express";
import { unitController } from "../controllers/unitController";
import { assetControler } from "../controllers/assetControler";
import { Unit } from "../models/unit";
export const unitRouter = Router();

unitRouter.route("/").post<{}, Unit, Unit>((req, res) => {
  unitController.create(req, res);
});

unitRouter.route("/list").get((req, res) => {
  unitController.list(req, res);
});

unitRouter.route("/:id").get((req, res) => {
  unitController.get(req, res);
});

unitRouter.route("/:id").patch((req, res) => {
  unitController.update(req, res);
});

unitRouter.route("/:id").delete((req, res) => {
  unitController.delete(req, res);
});

unitRouter.route("/:id/asset").post((req, res) => {
  assetControler.create(req, res);
});

unitRouter.route("/:id/asset/:assetId").get((req, res) => {
  assetControler.get(req, res);
});
