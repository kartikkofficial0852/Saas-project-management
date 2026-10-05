import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import organizationMiddleware from "../../middleware/organization.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import asyncHandler from "../../utils/async-handler.js";
import commentController from "./comment.controller.js";
import { createCommentSchema, updateCommentSchema } from "./comment.validator.js";

const router = Router();

router.post(
    "/:organizationId/projects/:projectId/tasks/:taskId/comments",
    authMiddleware,
    organizationMiddleware,
    validationMiddleware(createCommentSchema),
    asyncHandler(commentController.create)
);

router.get(
    "/:organizationId/projects/:projectId/tasks/:taskId/comments",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(commentController.getAll)
);

router.patch(
    "/:organizationId/projects/:projectId/tasks/:taskId/comments/:commentId",
    authMiddleware,
    organizationMiddleware,
    validationMiddleware(updateCommentSchema),
    asyncHandler(commentController.update)
);

router.delete(
    "/:organizationId/projects/:projectId/tasks/:taskId/comments/:commentId",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(commentController.delete)
);

export default router;