import AppError from "../../errors/app-error.js";
import { db } from "../../prisma/db.js";

const commentService = {
    async create(
        content: string,
        organizationId: number,
        projectId: number,
        taskId: number,
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

        const comment = await db.orm.public.Comment.create({
            content,
            taskId,
            createdByUserId: userId,
        });

        return comment;
    },

    async getAll(
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

        const comments = await db.orm.public.Comment
            .where({
                taskId,
            })
            .all();

        return comments;
    },

    async update(
        commentId: number,
        organizationId: number,
        projectId: number,
        taskId: number,
        userId: number,
        content: string
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

        const comment = await db.orm.public.Comment
            .where({
                id: commentId,
                taskId,
            })
            .first();

        if (!comment) {
            throw new AppError("Comment not found", 404);
        }

        if (comment.createdByUserId !== userId) {
            throw new AppError(
                "You can only update your own comment",
                403
            );
        }

        return await db.orm.public.Comment.where({ id: commentId }).update({
            content,
        });
    },

    async delete(
        commentId: number,
        organizationId: number,
        projectId: number,
        taskId: number,
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

        const comment = await db.orm.public.Comment
            .where({
                id: commentId,
                taskId,
            })
            .first();

        if (!comment) {
            throw new AppError("Comment not found", 404);
        }

        if (comment.createdByUserId !== userId) {
            throw new AppError(
                "You can only delete your own comment",
                403
            );
        }

        await db.orm.public.Comment.where({ id: commentId }).delete();
    },
};

export default commentService;