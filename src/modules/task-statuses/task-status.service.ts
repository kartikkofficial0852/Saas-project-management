import AppError from "../../errors/app-error.js";
import { db } from "../../prisma/db.js";
import cacheService from "../../services/cache.service.js";
import { TaskStatusModel } from "../../types/models.js";

const getStatusesCacheKey = (organizationId: number, projectId: number) =>
    `organization:${organizationId}:project:${projectId}:statuses`;

const taskStatusService = {
    async create(
        name: string,
        position: number,
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

        const existingStatus =
            await db.orm.public.TaskStatus
                .where({
                    projectId,
                    name,
                })
                .first();

        if (existingStatus) {
            throw new AppError(
                "Status already exists in this project",
                409
            );
        }

        const status = await db.transaction(async (tx) => {
            const status =
                await tx.orm.public.TaskStatus.create({
                    name,
                    position,
                    projectId,
                });

            await tx.orm.public.AuditLog.create({
                action: "STATUS_CREATED",
                entityType: "TASK_STATUS",
                entityId: status.id,
                metadata: {
                    name,
                    position,
                },
                projectId,
                createdByUserId: userId,
            });

            return status;
        });

        await cacheService.delete(
            getStatusesCacheKey(organizationId, projectId)
        );

        return status;
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

        const cacheKey = getStatusesCacheKey(organizationId, projectId);

        const cachedStatuses =
            await cacheService.get<TaskStatusModel[]>(cacheKey);

        if (cachedStatuses) {
            return cachedStatuses;
        }

        const statuses =
            await db.orm.public.TaskStatus
                .where({ projectId })
                .all();

        const sortedStatuses = statuses.sort(
            (a, b) => a.position - b.position
        );

        await cacheService.set(cacheKey, sortedStatuses, 60 * 5); // Cache for 5 minutes

        return sortedStatuses;
    },

    async update(
        statusId: number,
        name: string | undefined,
        position: number | undefined,
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

        const status =
            await db.orm.public.TaskStatus
                .where({
                    id: statusId,
                    projectId,
                })
                .first();

        if (!status) {
            throw new AppError(
                "Task status not found",
                404
            );
        }

        // Check duplicate name only when name is being changed
        if (name !== undefined && name !== status.name) {
            const existingStatus =
                await db.orm.public.TaskStatus
                    .where({
                        projectId,
                        name,
                    })
                    .first();

            if (
                existingStatus &&
                existingStatus.id !== statusId
            ) {
                throw new AppError(
                    "Status already exists in this project",
                    409
                );
            }
        }

        const updatedName = name ?? status.name;
        const updatedPosition = position ?? status.position;

        const updatedStatus = await db.transaction(async (tx) => {
            const updatedStatus =
                await tx.orm.public.TaskStatus.where({ id: statusId }).update({
                    name: updatedName,
                    position: updatedPosition,
                });

            await tx.orm.public.AuditLog.create({
                action: "STATUS_UPDATED",
                entityType: "TASK_STATUS",
                entityId: statusId,
                metadata: {
                    previousName: status.name,
                    newName: updatedName,
                    previousPosition: status.position,
                    newPosition: updatedPosition,
                },
                projectId,
                createdByUserId: userId,
            });

            return updatedStatus;
        });

        await cacheService.delete(
            getStatusesCacheKey(organizationId, projectId)
        );

        return updatedStatus;
    },

    async delete(
        statusId: number,
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

        const status =
            await db.orm.public.TaskStatus
                .where({
                    id: statusId,
                    projectId,
                })
                .first();

        if (!status) {
            throw new AppError(
                "Task status not found",
                404
            );
        }

        const tasks =
            await db.orm.public.Task
                .where({
                    statusId,
                })
                .all();

        if (tasks.length > 0) {
            throw new AppError(
                "Cannot delete a status that has tasks",
                400
            );
        }

        await db.orm.public.TaskStatus.where({ id: statusId }).delete();

        await cacheService.delete(
            getStatusesCacheKey(organizationId, projectId)
        );
    },
};

export default taskStatusService;