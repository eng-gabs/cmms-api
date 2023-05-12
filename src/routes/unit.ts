import { Router } from "express";
import { unitController } from "../controllers/unitController";
import { Unit } from "../models/unit";
export const unitRouter = Router();

type ReqParamId = { id: string };
type ResBody<T> = { data: T };
type ResBodyWithPagination<T> = {
  data: T[];
  previousUrl: string;
  nextUrl: string;
};
type ResBodyDelete<T> = { message: string; data: T };
type _ = {};

unitRouter.route("/").post<_, Unit, Unit>(async (req, res) => {
  await unitController.create(req, res);
});

unitRouter
  .route("/:id")
  .get<ReqParamId, Unit, ResBody<Unit>>(async (req, res) => {
    await unitController.get(req, res);
  });

unitRouter
  .route("/:id")
  .patch<ReqParamId, Unit, ResBody<Unit>>(async (req, res) => {
    await unitController.update(req, res);
  });

unitRouter
  .route("/:id")
  .delete<ReqParamId, _, ResBodyDelete<Unit>>(async (req, res) => {
    await unitController.delete(req, res);
  });

unitRouter
  .route("/")
  .get<_, { companyId: string }, ResBodyWithPagination<Unit>>(
    async (req, res) => {
      await unitController.list(req, res);
    }
  );
