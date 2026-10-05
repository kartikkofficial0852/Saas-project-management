import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import organizationMiddleware from "../../middleware/organization.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import asyncHandler from "../../utils/async-handler.js";
import labelController from "./label.controller.js";
import {
    createLabelSchema,
    updateLabelSchema,
    taskLabelSchema,
} from "./label.validator.js";

const router = Router();

router.post(
    "/:organizationId/projects/:projectId/labels",
    authMiddleware,
    organizationMiddleware,
    validationMiddleware(createLabelSchema),
    asyncHandler(labelController.create)
);

router.get(
    "/:organizationId/projects/:projectId/labels",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(labelController.getAll)
);

router.patch(
    "/:organizationId/projects/:projectId/labels/:labelId",
    authMiddleware,
    organizationMiddleware,
    validationMiddleware(updateLabelSchema),
    asyncHandler(labelController.update)
);

router.delete(
    "/:organizationId/projects/:projectId/labels/:labelId",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(labelController.delete)
);

router.post(
    "/:organizationId/projects/:projectId/tasks/:taskId/labels",
    authMiddleware,
    organizationMiddleware,
    validationMiddleware(taskLabelSchema),
    asyncHandler(labelController.addToTask)
);

router.delete(
    "/:organizationId/projects/:projectId/tasks/:taskId/labels/:labelId",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(labelController.removeFromTask)
);

export default router;