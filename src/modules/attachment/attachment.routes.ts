

import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import organizationMiddleware from "../../middleware/organization.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import asyncHandler from "../../utils/async-handler.js";
import attachmentController from "./attachment.controller.js";
import {
    createAttachmentSchema,
} from "./attachment.validator.js";

const router = Router();

router.post(
    "/:organizationId/projects/:projectId/tasks/:taskId/attachments",
    authMiddleware,
    organizationMiddleware,
    validationMiddleware(createAttachmentSchema),
    asyncHandler(attachmentController.create)
);

router.get(
    "/:organizationId/projects/:projectId/tasks/:taskId/attachments",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(attachmentController.getAll)
);

router.get(
    "/:organizationId/projects/:projectId/tasks/:taskId/attachments/:attachmentId",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(attachmentController.getById)
);

router.delete(
    "/:organizationId/projects/:projectId/tasks/:taskId/attachments/:attachmentId",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(attachmentController.delete)
);

export default router;