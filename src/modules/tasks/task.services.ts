import AppError from "../../errors/app-error.js";
import { db } from "../../prisma/db.js";

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


        return await db.transaction(async (tx) => {
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

            if (
                assignedToUserId &&
                assignedToUserId !== userId
            ) {
                await tx.orm.public.Notification.create({
                    type: "TASK_ASSIGNED",
                    message: `You have been assigned a task: ${task.title}`,
                    entityType: "TASK",
                    entityId: task.id,
                    userId: assignedToUserId,
                });
            }

            return task;
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

        return await db.orm.public.Task
            .where({ projectId })
            .all();
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

        return await db.orm.public.Task.where({ id: taskId }).update({
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(statusId !== undefined && { statusId }),
            ...(assignedToUserId !== undefined && {
                assignedToUserId,
            }),
        });
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

        return await db.transaction(async (tx) => {
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

            if (
                assignedToUserId &&
                assignedToUserId !== userId &&
                assignedToUserId !== task.assignedToUserId
            ) {
                await tx.orm.public.Notification.create({
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

            return updatedTask;
        });
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

        return await db.transaction(async (tx) => {
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
    },
};

export default taskService;