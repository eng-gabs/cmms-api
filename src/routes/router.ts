import { Router } from "express";
import { userRouter } from "./user";
import { companyRouter } from "./company";
import { unitRouter } from "./unit";

export const router = Router();

router.use("/user", userRouter);
router.use("/company", companyRouter);
router.use("/unit", unitRouter);
