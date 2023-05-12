import { Router } from "express";
import { assetControler } from "../controllers/assetControler";

export const assetRouter = Router();

assetRouter.route("/").post(async (req, res) => {
  await assetControler.create(req, res);
});

assetRouter.route("/:id").get(async (req, res) => {
  await assetControler.get(req, res);
});

assetRouter.route("/:id").delete(async (req, res) => {
  await assetControler.delete(req, res);
});

assetRouter.route("/:id").patch(async (req, res) => {
  await assetControler.update(req, res);
});
