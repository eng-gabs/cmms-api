import { Router } from "express";
import { userRouter } from "./user";
import { companyRouter } from "./company";

export const router = Router();

router.use("/user", userRouter);
router.use("/company", companyRouter);
