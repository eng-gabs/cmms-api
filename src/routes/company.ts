import { Router } from "express";
import { companyController } from "../controllers/companyController";

export const companyRouter = Router();

companyRouter.route("/").post(async (req, res) => {
  await companyController.create(req, res);
});

companyRouter.route("/:id").get(async (req, res) => {
  await companyController.getById(req, res);
});

companyRouter.route("/:id").patch(async (req, res) => {
  await companyController.update(req, res);
});

companyRouter.route("/:id").delete(async (req, res) => {
  await companyController.delete(req, res);
});

companyRouter.route("/:id/info").get(async (req, res) => {
  await companyController.info(req, res);
});
