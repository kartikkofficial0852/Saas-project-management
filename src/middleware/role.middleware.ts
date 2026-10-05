import type { RequestHandler } from "express";
import AppError from "../errors/app-error.js";
import type { OrganizationRole } from "../types/organization.js";

const requireOrganizationRole = (
    ...allowedRoles: OrganizationRole[]
): RequestHandler => {
    return (req, res, next) => {
        const membership =
            req.organizationMembership;

        if (!membership) {
            throw new AppError(
                "Organization membership required",
                403
            );
        }

        if (!allowedRoles.includes(membership.role)) {
            throw new AppError(
                "You do not have permission to perform this action",
                403
            );
        }

        next();
    };
};

export default requireOrganizationRole;