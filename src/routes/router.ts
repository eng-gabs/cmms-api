import { Router } from "express";
import { userRouter } from "./user";
import { companyRouter } from "./company";
import { unitRouter } from "./unit";
import { assetRouter } from "./asset";

export const router = Router();

router.use("/user", userRouter);
router.use("/company", companyRouter);
router.use("/unit", unitRouter);
router.use("/asset", assetRouter);
