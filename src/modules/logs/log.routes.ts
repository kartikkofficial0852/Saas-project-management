import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import organizationMiddleware from "../../middleware/organization.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import asyncHandler from "../../utils/async-handler.js";
import logController from "./log.controller.js";
import { createLogSchema } from "./log.validator.js";

const router = Router();

router.post(
    "/:organizationId/projects/:projectId/logs",
    authMiddleware,
    organizationMiddleware,
    validationMiddleware(createLogSchema),
    asyncHandler(logController.create)
);

router.get(
    "/:organizationId/projects/:projectId/logs",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(logController.getAll)
);

export default router;