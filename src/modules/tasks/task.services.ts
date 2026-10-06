import AppError from "../../errors/app-error.js";
import { db } from "../../prisma/db.js";
import cacheService from "../../services/cache.service.js";
import { getIO } from "../../socket/socket.js";
import { TaskModel } from "../../types/models.js";

const getTasksCacheKey = (
    organizationId: number,
    projectId: number
) =>
    `organization:${organizationId}:project:${projectId}:tasks`;

const taskService = {
    async create(
        title: string,
        description: string | undefined,
        statusId: number | undefined,
        assignedToUserId: number | undefined,
        organizationId: number,
        projectId: number,
        userId: number
    ) {
        // Verify project belongs to this organization
        const project = await db.orm.public.Project
            .where({
                id: projectId,
                organizationId,
            })
            .first();

        if (!project) {
            throw new AppError("Project not found", 404);
        }

        // If no status was provided, use TODO
        let finalStatusId = statusId;

        // Verify status belongs to this project
        const status = await db.orm.public.TaskStatus
            .where({
                id: finalStatusId,
                projectId,
            })
            .first();

        if (!status) {
            throw new AppError(
                "Task status does not belong to this project",
                400
            );
        }

        // Verify assignee belongs to the organization
        if (assignedToUserId !== undefined) {
            const membership =
                await db.orm.public.OrganizationMember
                    .where({
                        organizationId,
                        userId: assignedToUserId,
                    })
                    .first();

            if (!membership) {
                throw new AppError(
                    "Assigned user is not a member of this organization",
                    400
                );
            }
        }

        // Create task
        const result = await db.transaction(async (tx) => {
            const task = await tx.orm.public.Task.create({
                title,
                description,
                projectId,
                createdByUserId: userId,
                assignedToUserId,
                statusId,
            });

            await tx.orm.public.AuditLog.create({
                action: "TASK_CREATED",
                entityType: "TASK",
                entityId: task.id,
                projectId,
                createdByUserId: userId,
            });

            let notification = null;
            if (
                assignedToUserId &&
                assignedToUserId !== userId
            ) {
                notification = await tx.orm.public.Notification.create({
                    type: "TASK_ASSIGNED",
                    message: `You have been assigned a task: ${task.title}`,
                    entityType: "TASK",
                    entityId: task.id,
                    userId: assignedToUserId,
                });
            }


            return {
                task,
                notification
            };
        });

        const io = getIO();

        io.to(`organization:${organizationId}:project:${projectId}`
        ).emit("task_created", {
            task: result!.task,
        });

        if (result.notification) {
            io.to(`user:${result.notification.userId}`).emit("notification.created", {
                notification: result.notification,
            });
        }


        await cacheService.delete(
            getTasksCacheKey(organizationId, projectId)
        );

        await cacheService.delete(
            `organization:${organizationId}:dashboard`
        );

        return result.task;
    },

    async getAll(
        organizationId: number,
        projectId: number,
        filters: {
            search?: string;
            statusId?: number;
            assignedToUserId?: number;
            page: number;
            limit: number;
        }
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

        const shouldCache =
            !filters.search &&
            filters.statusId === undefined &&
            filters.assignedToUserId === undefined;

        const cacheKey = getTasksCacheKey(
            organizationId,
            projectId
        );

        if (shouldCache) {
            const cachedTasks =
                await cacheService.get<{
                    tasks: TaskModel[];
                    pagination: {
                        page: number;
                        limit: number;
                        total: number;
                        totalPages: number;
                    };
                }>(cacheKey);

            if (cachedTasks) {
                return cachedTasks;
            }
        }

        let query = db.orm.public.Task.where({
            projectId,
        });

        if (filters.statusId !== undefined) {
            query = query.where((task) =>
                task.statusId.eq(filters.statusId!)
            );
        }

        if (filters.assignedToUserId !== undefined) {
            query = query.where((task) =>
                task.assignedToUserId.eq(
                    filters.assignedToUserId!
                )
            );
        }

        if (filters.search) {
            query = query.where((task) =>
                task.title.like(`%${filters.search!}%`)
            );
        }

        const total =
            await query.aggregate((a) => ({
                total: a.count(),
            }));

        const offset =
            (filters.page - 1) * filters.limit;

        const tasks = await query
            .orderBy((task) =>
                task.createdAt.desc()
            )
            .offset(offset)
            .limit(filters.limit)
            .all();

        const result = {
            tasks,
            pagination: {
                page: filters.page,
                limit: filters.limit,
                total: total.total,
                totalPages: Math.ceil(
                    total.total / filters.limit
                ),
            },
        };

        if (shouldCache) {
            await cacheService.set(
                cacheKey,
                result,
                300
            );
        }

        return result;
    },

    async getOne(
        organizationId: number,
        projectId: number,
        taskId: number
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

        const task = await db.orm.public.Task
            .where({
                id: taskId,
                projectId,
            })
            .first();

        if (!task) {
            throw new AppError("Task not found", 404);
        }

        return task;
    },

    async update(
        taskId: number,
        projectId: number,
        organizationId: number,
        title: string | undefined,
        description: string | null | undefined,
        statusId: number | undefined,
        assignedToUserId: number | null | undefined
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

        const task = await db.orm.public.Task
            .where({
                id: taskId,
                projectId,
            })
            .first();

        if (!task) {
            throw new AppError("Task not found", 404);
        }

        if (statusId !== undefined) {
            const status = await db.orm.public.TaskStatus
                .where({
                    id: statusId,
                    projectId,
                })
                .first();

            if (!status) {
                throw new AppError(
                    "Task status does not belong to this project",
                    400
                );
            }
        }

        if (assignedToUserId !== undefined && assignedToUserId !== null) {
            const membership =
                await db.orm.public.OrganizationMember
                    .where({
                        organizationId,
                        userId: assignedToUserId,
                    })
                    .first();

            if (!membership) {
                throw new AppError(
                    "Assigned user is not a member of this organization",
                    400
                );
            }
        }

        const updatedTask = await db.orm.public.Task.where({ id: taskId }).update({
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(statusId !== undefined && { statusId }),
            ...(assignedToUserId !== undefined && {
                assignedToUserId,
            }),
        });

        const io = getIO();

        io.to(`organization:${organizationId}:project:${projectId}`
        ).emit("task_updated", {
            task: updatedTask,
        });

        await cacheService.delete(
            getTasksCacheKey(organizationId, projectId)
        );

        await cacheService.delete(
            `organization:${organizationId}:dashboard`
        );

        return updatedTask;
    },
    async delete(
        taskId: number,
        projectId: number,
        organizationId: number
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

        const task = await db.orm.public.Task
            .where({
                id: taskId,
                projectId,
            })
            .first();

        if (!task) {
            throw new AppError("Task not found", 404);
        }

        await db.orm.public.Task.where({ id: taskId }).delete();

        const io = getIO();

        io.to(`organization:${organizationId}:project:${projectId}`
        ).emit("task_deleted", {
            id: taskId,
        });


        await cacheService.delete(
            getTasksCacheKey(organizationId, projectId)
        );

        await cacheService.delete(
            `organization:${organizationId}:dashboard`
        );
    },

    async updateAssignee(
        taskId: number,
        projectId: number,
        organizationId: number,
        assignedToUserId: number | null,
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

        const task = await db.orm.public.Task
            .where({
                id: taskId,
                projectId,
            })
            .first();

        if (!task) {
            throw new AppError("Task not found", 404);
        }

        if (assignedToUserId !== null) {
            const membership =
                await db.orm.public.OrganizationMember
                    .where({
                        organizationId,
                        userId: assignedToUserId,
                    })
                    .first();

            if (!membership) {
                throw new AppError(
                    "Assigned user is not a member of this organization",
                    400
                );
            }
        }

        const result = await db.transaction(async (tx) => {
            const updatedTask =
                await tx.orm.public.Task.where({ id: taskId }).update({
                    assignedToUserId,
                });

            await tx.orm.public.AuditLog.create({
                action: "TASK_ASSIGNED",
                entityType: "TASK",
                entityId: taskId,
                metadata: {
                    previousAssigneeId:
                        task.assignedToUserId,
                    newAssigneeId:
                        assignedToUserId,
                },
                projectId,
                createdByUserId: userId,
            });

            let notification = null;
            if (
                assignedToUserId &&
                assignedToUserId !== userId &&
                assignedToUserId !== task.assignedToUserId
            ) {
                notification = await tx.orm.public.Notification.create({
                    type: "TASK_ASSIGNED",
                    message: `You have been assigned a task: ${task.title}`,
                    entityType: "TASK",
                    entityId: taskId,
                    userId: assignedToUserId,
                    metadata: {
                        assignedByUserId: userId,
                    },
                });
            }

            return {
                task: updatedTask,
                notification
            };
        });

        const io = getIO();

        io.to(`organization:${organizationId}:project:${projectId}`
        ).emit("task.assigned", {
            task: result.task,
        });

        if (result.notification) {
            io.to(`user:${result.notification.userId}`).emit("notification.created", {
                notification: result.notification,
            });
        }

        await cacheService.delete(
            `organization:${organizationId}:dashboard`
        );

        return result.task;
    },


    async updateStatus(
        taskId: number,
        projectId: number,
        organizationId: number,
        statusId: number,
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

        const task = await db.orm.public.Task
            .where({
                id: taskId,
                projectId,
            })
            .first();

        if (!task) {
            throw new AppError("Task not found", 404);
        }

        const status = await db.orm.public.TaskStatus
            .where({
                id: statusId,
                projectId,
            })
            .first();

        if (!status) {
            throw new AppError(
                "Task status does not belong to this project",
                400
            );
        }

        if (task.statusId === statusId) {
            throw new AppError(
                "Task is already in this status",
                400
            );
        }

        const updatedTask = await db.transaction(async (tx) => {
            const updatedTask =
                await tx.orm.public.Task.where({ id: taskId }).update({
                    statusId,
                });

            await tx.orm.public.AuditLog.create({
                action: "TASK_STATUS_CHANGED",
                entityType: "TASK",
                entityId: taskId,
                metadata: {
                    previousStatusId: task.statusId,
                    newStatusId: statusId,
                },
                projectId,
                createdByUserId: userId,
            });

            return updatedTask;
        });

        const io = getIO();

        io.to(`organization:${organizationId}:project:${projectId}`
        ).emit("task.status_changed", {
            task: updatedTask,
        });

        await cacheService.delete(
            `organization:${organizationId}:dashboard`
        );

        return updatedTask;
    },
};

export default taskService;