import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import asyncHandler from "../../utils/async-handler";
import organizationController from "./organization.controller";
import validationMiddleware from "../../middleware/validation.middleware";
import { addMemberSchema, createOrganizationSchema, updateMemberRoleSchema } from "./organization.validator";
import organizationMiddleware from "../../middleware/organization.middleware";
import requireOrganizationRole from "../../middleware/role.middleware";


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