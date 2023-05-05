import { Router } from "express";
import { userController } from "../controllers/userController";

export const userRouter = Router();

userRouter.route("/all").get((req, res) => {
  userController.getAll(req, res);
});

userRouter.route("/create").get((req, res) => {
  userController.create(req, res);
});
