import { Router } from "express";
import { userController } from "../controllers/userController";

export const userRouter = Router();

userRouter.route("/all").get(async (req, res) => {
  await userController.getAll(req, res);
});

userRouter.route("/").post(async (req, res) => {
  await userController.create(req, res);
});

userRouter.route("/:id").get(async (req, res) => {
  await userController.getById(req, res);
});

userRouter.route("/:id").put(async (req, res) => {
  await userController.updateById(req, res);
});

userRouter.route("/:id").delete(async (req, res) => {
  await userController.deleteById(req, res);
});
