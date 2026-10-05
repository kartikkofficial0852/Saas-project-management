import AppError from "../../errors/app-error.js";
import { db } from "../../prisma/db.js";

const labelService = {
    async create(
        name: string,
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

        const existingLabel = await db.orm.public.Label
            .where({
                projectId,
                name,
            })
            .first();

        if (existingLabel) {
            throw new AppError(
                "Label already exists in this project",
                409
            );
        }

        return await db.orm.public.Label.create({
            name,
            projectId,
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

        return await db.orm.public.Label
            .where({
                projectId,
            })
            .all();
    },

    async update(
        labelId: number,
        name: string,
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

        const label = await db.orm.public.Label
            .where({
                id: labelId,
                projectId,
            })
            .first();

        if (!label) {
            throw new AppError("Label not found", 404);
        }

        const existingLabel = await db.orm.public.Label
            .where({
                projectId,
                name,
            })
            .first();

        if (
            existingLabel &&
            existingLabel.id !== labelId
        ) {
            throw new AppError(
                "Label already exists in this project",
                409
            );
        }

        return await db.orm.public.Label.where({ id: labelId }).update({
            name,
        });
    },

    async delete(
        labelId: number,
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

        const label = await db.orm.public.Label
            .where({
                id: labelId,
                projectId,
            })
            .first();

        if (!label) {
            throw new AppError("Label not found", 404);
        }

        await db.orm.public.Label.where({ id: labelId }).delete();
    },

    async addToTask(
        labelId: number,
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

        const label = await db.orm.public.Label
            .where({
                id: labelId,
                projectId,
            })
            .first();

        if (!label) {
            throw new AppError("Label not found", 404);
        }

        const existingTaskLabel =
            await db.orm.public.TaskLabel
                .where({
                    taskId,
                    labelId,
                })
                .first();

        if (existingTaskLabel) {
            throw new AppError(
                "Label is already attached to this task",
                409
            );
        }

        return await db.orm.public.TaskLabel.create({
            taskId,
            labelId,
        });
    },

    async removeFromTask(
        labelId: number,
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

        const taskLabel =
            await db.orm.public.TaskLabel
                .where({
                    taskId,
                    labelId,
                })
                .first();

        if (!taskLabel) {
            throw new AppError(
                "Label is not attached to this task",
                404
            );
        }

        await db.orm.public.TaskLabel.where({ taskId, labelId }).delete();
    },
};

export default labelService;