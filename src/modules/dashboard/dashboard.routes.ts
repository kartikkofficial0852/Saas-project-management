
import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import organizationMiddleware from "../../middleware/organization.middleware.js";
import asyncHandler from "../../utils/async-handler.js";
import dashboardController from "./dashboard.controller.js";

const router = Router();

router.get(
    "/:organizationId/dashboard",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(
        dashboardController.getDashboard
    )
);

export default router;