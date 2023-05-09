import { Router } from "express";
import { companyController } from "../controllers/companyController";

export const companyRouter = Router();

companyRouter.route("/").post((req, res) => {
  companyController.create(req, res);
});

companyRouter.route("/all").get((req, res) => {
  companyController.getAll(req, res);
});

companyRouter.route("/:id").get((req, res) => {
  companyController.getById(req, res);
});