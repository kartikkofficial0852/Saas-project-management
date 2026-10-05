import { Router } from "express";
import asyncHandler from "../../utils/async-handler.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import organizationMiddleware from "../../middleware/organization.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import requireOrganizationRole from "../../middleware/role.middleware.js";
import projectController from "./project.controller.js";
import { createProjectSchema, updateProjectSchema } from "./project.validator.js";

const router = Router();

router.get(
    "/:organizationId/projects",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(projectController.getAll)
);

router.get(
    "/:organizationId/projects/:projectId",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(projectController.getById)
);

router.post(
    "/:organizationId/projects",
    authMiddleware,
    organizationMiddleware,
    requireOrganizationRole("OWNER", "ADMIN"),
    validationMiddleware(createProjectSchema),
    asyncHandler(projectController.create)
);

router.patch(
    "/:organizationId/projects/:projectId",
    authMiddleware,
    organizationMiddleware,
    requireOrganizationRole("OWNER", "ADMIN"),
    validationMiddleware(updateProjectSchema),
    asyncHandler(projectController.update)
);

router.delete(
    "/:organizationId/projects/:projectId",
    authMiddleware,
    organizationMiddleware,
    requireOrganizationRole("OWNER", "ADMIN"),
    asyncHandler(projectController.delete)
);


export default router;