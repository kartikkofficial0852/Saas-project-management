import { JsonValue } from "@prisma/orm-postgres/contract";
import AppError from "../../errors/app-error.js";
import { db } from "../../prisma/db.js";
import cacheService from "../../services/cache.service.js";
import { AuditLogModel } from "../../types/models.js";

const getLogsCacheKey = (
    organizationId: number,
    projectId: number
) => `organization:${organizationId}:project:${projectId}:logs`;

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

        const log = await db.orm.public.AuditLog.create({
            action,
            entityType,
            entityId,
            metadata,
            projectId,
            createdByUserId: userId,
        });

        await cacheService.delete(
            getLogsCacheKey(organizationId, projectId)
        );

        return log;
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

        const cacheKey = getLogsCacheKey(organizationId, projectId);

        const cachedLogs = await cacheService.get<AuditLogModel[]>(cacheKey);

        if (cachedLogs) {
            return cachedLogs;
        }

        const logs = await db.orm.public.AuditLog
            .where({ projectId })
            .all();

        await cacheService.set(cacheKey, logs, 60 * 5); // Cache for 5 minutes

        return logs;
    },
};

export default logService;