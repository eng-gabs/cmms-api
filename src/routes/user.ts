import { Router } from "express";
import { userController } from "../controllers/userController";

export const userRouter = Router();

userRouter.route("/all").get((req, res) => {
  userController.getAll(req, res);
});

userRouter.route("/").post((req, res) => {
  userController.create(req, res);
});

userRouter.route("/:id").get((req, res) => {
  userController.getById(req, res);
});

userRouter.route("/:id").put((req, res) => {
  userController.updateById(req, res);
});

userRouter.route("/:id").delete((req, res) => {
  userController.deleteById(req, res);
});
