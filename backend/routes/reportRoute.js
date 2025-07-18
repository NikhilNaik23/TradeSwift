import express from "express";
import {
  reportProduct,
  getAllReports,
  resolveReport,
} from "../controllers/reportController.js";
import { protectRoute,restrictToAdminEmail } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/product/:id", protectRoute, reportProduct);

router.get(
  "/",
  protectRoute,
  restrictToAdminEmail("admin@ts.com"),
  getAllReports
);

router.patch(
  "/:id",
  protectRoute,
  restrictToAdminEmail("admin@ts.com"),
  resolveReport
);

export default router;
