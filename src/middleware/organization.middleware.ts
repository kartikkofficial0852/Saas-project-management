import type { RequestHandler } from "express";
import AppError from "../errors/app-error.js";
import { db } from "../prisma/db.js";
import { OrganizationRole } from "../types/organization.js";

const organizationMiddleware: RequestHandler = async (
    req,
    res,
    next
) => {
    const organizationId = Number(
        req.params.organizationId
    );

    if (!Number.isInteger(organizationId)) {
        throw new AppError(
            "Invalid organization ID",
            400
        );
    }

    const userId = req.user!.id;

    const membership =
        await db.orm.public.OrganizationMember
            .where({
                organizationId,
                userId,
            })
            .first();

    if (!membership) {
        throw new AppError(
            "You are not a member of this organization",
            403
        );
    }

    req.organizationMembership = {
        organizationId: membership.organizationId,
        userId: membership.userId,
        role: membership.role as OrganizationRole,
    };

    next();
};

export default organizationMiddleware;