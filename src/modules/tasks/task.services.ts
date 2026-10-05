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
        const task = await db.orm.public.Task.create({
            title,
            description,
            projectId,
            createdByUserId: userId,
            statusId: finalStatusId,
            assignedToUserId,
        });

        return task;
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
        assignedToUserId: number | null
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

        return await db.orm.public.Task.where({ id: taskId }).update({
            assignedToUserId,
        });
    },


    async updateStatus(
        taskId: number,
        projectId: number,
        organizationId: number,
        statusId: number
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

        return await db.orm.public.Task.where({ id: taskId }).update({
            statusId,
        });
    },
};

export default taskService;