import { Router } from "express";
import { assetControler } from "../controllers/assetControler";

export const assetRouter = Router();

assetRouter.route("/:id").delete((req, res) => {
  assetControler.delete(req, res);
});

assetRouter.route("/:id").patch((req, res) => {
  assetControler.update(req, res);
});
