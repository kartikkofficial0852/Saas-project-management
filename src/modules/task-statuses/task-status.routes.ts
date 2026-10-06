import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import organizationMiddleware from "../../middleware/organization.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import asyncHandler from "../../utils/async-handler.js";
import taskStatusController from "./task-status.controller.js";
import {
    createTaskStatusSchema,
    updateTaskStatusSchema,
} from "./task-status.validator.js";

const router = Router();

router.post(
    "/:organizationId/projects/:projectId/statuses",
    authMiddleware,
    organizationMiddleware,
    validationMiddleware(createTaskStatusSchema),
    asyncHandler(taskStatusController.create)
);

router.get(
    "/:organizationId/projects/:projectId/statuses",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(taskStatusController.getAll)
);

router.patch(
    "/:organizationId/projects/:projectId/statuses/:statusId",
    authMiddleware,
    organizationMiddleware,
    validationMiddleware(updateTaskStatusSchema),
    asyncHandler(taskStatusController.update)
);

router.delete(
    "/:organizationId/projects/:projectId/statuses/:statusId",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(taskStatusController.delete)
);

export default router;