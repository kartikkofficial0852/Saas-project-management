import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import asyncHandler from "../../utils/async-handler.js";
import organizationController from "./organization.controller.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import { addMemberSchema, createOrganizationSchema, updateMemberRoleSchema } from "./organization.validator.js";
import organizationMiddleware from "../../middleware/organization.middleware.js";
import requireOrganizationRole from "../../middleware/role.middleware.js";


const router = Router();

router.post(
    '/',
    authMiddleware,
    validationMiddleware(createOrganizationSchema),
    asyncHandler(organizationController.create)
);

router.get(
    "/:organizationId/members",
    authMiddleware,
    organizationMiddleware,
    asyncHandler(organizationController.getMembers)
);

router.post(
    "/:organizationId/members",
    authMiddleware,
    organizationMiddleware,
    requireOrganizationRole("OWNER", "ADMIN"),
    validationMiddleware(addMemberSchema),
    asyncHandler(organizationController.addMember)
);

router.patch(
    "/:organizationId/members/:userId",
    authMiddleware,
    organizationMiddleware,
    requireOrganizationRole("OWNER"),
    validationMiddleware(updateMemberRoleSchema),
    asyncHandler(organizationController.updateMemberRole)
);
router.delete(
    "/:organizationId/members/:userId",
    authMiddleware,
    organizationMiddleware,
    requireOrganizationRole("OWNER"),
    asyncHandler(organizationController.removeMember)
);
export default router;