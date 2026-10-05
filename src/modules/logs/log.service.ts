import { JsonValue } from "@prisma/orm-postgres/contract";
import AppError from "../../errors/app-error.js";
import { db } from "../../prisma/db.js";

const logService = {
    async create(
        action: string,
        entityType: string,
        entityId: number,
        metadata: JsonValue | undefined,
        organizationId: number,
        projectId: number,
        userId: number
    ) {
        const project = await db.orm.public.Project
            .where({
                id: projectId,
                organizationId,
            })
            .first();

        if (!project) {
            throw new AppError("Project not found", 404);
        }

        return await db.orm.public.AuditLog.create({
            action,
            entityType,
            entityId,
            metadata,
            projectId,
            createdByUserId: userId,
        });
    },

    async getAll(
        organizationId: number,
        projectId: number
    ) {
        const project = await db.orm.public.Project
            .where({
                id: projectId,
                organizationId,
            })
            .first();

        if (!project) {
            throw new AppError("Project not found", 404);
        }

        return await db.orm.public.AuditLog
            .where({ projectId })
            .all();
    },
};

export default logService;