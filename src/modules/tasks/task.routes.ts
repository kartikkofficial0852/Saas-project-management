import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import organizationMiddleware from "../../middleware/organization.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import asyncHandler from "../../utils/async-handler.js";
import taskController from "./task.controller.js";
import { createTaskSchema, getTasksQuerySchema, updateTaskAssigneeSchema, updateTaskSchema, updateTaskStatusSchema } from "./task.validator.js";
import queryValidationMiddleware from "../../middleware/query-validation.middleware.js";

const router = Router();

router.post(
    "/:organizationId/projects/:projectId/tasks",
    authMiddleware,
    organizationMiddleware,
    validationMiddleware(createTaskSchema),
    asyncHandler(taskController.create)
);

router.get(
    "/:organizationId/projects/:projectId/tasks",
    authMiddleware,
    organizationMiddleware,
    queryValidationMiddleware(getTasksQuerySchema),
    asyncHandler(taskController.getAll)
);

router.get(
    "/:organizationId/projects/:projectId/tasks/:taskId",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(taskController.getOne)
);

router.patch(
    "/:organizationId/projects/:projectId/tasks/:taskId",
    authMiddleware,
    organizationMiddleware,
    validationMiddleware(updateTaskSchema),
    asyncHandler(taskController.update)
);

router.delete(
    "/:organizationId/projects/:projectId/tasks/:taskId",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(taskController.delete)
);

router.patch(
    "/:organizationId/projects/:projectId/tasks/:taskId/assignee",
    authMiddleware,
    organizationMiddleware,
    validationMiddleware(updateTaskAssigneeSchema),
    asyncHandler(taskController.updateAssignee)
);

router.patch(
    "/:organizationId/projects/:projectId/tasks/:taskId/status",
    authMiddleware,
    organizationMiddleware,
    validationMiddleware(updateTaskStatusSchema),
    asyncHandler(taskController.updateStatus)
);

export default router;