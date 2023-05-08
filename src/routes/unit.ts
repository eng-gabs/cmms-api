import { Router } from "express";
import { unitController } from "../controllers/unitController";
export const unitRouter = Router();

unitRouter.route("/").post((req, res) => {
  unitController.create(req, res);
});

unitRouter.route("/list").get((req, res) => {
  unitController.list(req, res);
});

unitRouter.route("/:id").get((req, res) => {
  unitController.get(req, res);
});

unitRouter.route("/:id").put((req, res) => {
  unitController.update(req, res);
});

unitRouter.route("/:id").delete((req, res) => {
  unitController.delete(req, res);
});
