import AppError from "../../errors/app-error.js";
import { db } from "../../prisma/db.js";
import { getIO } from "../../socket/socket.js";

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

        const comment = await db.transaction(async (tx) => {
            const comment =
                await tx.orm.public.Comment.create({
                    content,
                    taskId,
                    createdByUserId: userId,
                });

            await tx.orm.public.AuditLog.create({
                action: "COMMENT_CREATED",
                entityType: "COMMENT",
                entityId: comment.id,
                metadata: {
                    taskId,
                },
                projectId,
                createdByUserId: userId,
            });

            return comment;
        });

        const io = getIO();

        io.to(
            `organization:${organizationId}:project:${projectId}`
        ).emit("comment.created", {
            comment,
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
                "You can only update your own comments",
                403
            );
        }

        const updatedComment = await db.transaction(async (tx) => {
            const updatedComment =
                await tx.orm.public.Comment.where({ id: commentId }).update({
                    content,
                });

            await tx.orm.public.AuditLog.create({
                action: "COMMENT_UPDATED",
                entityType: "COMMENT",
                entityId: commentId,
                metadata: {
                    taskId,
                },
                projectId,
                createdByUserId: userId,
            });

            return updatedComment;
        });

        const io = getIO();

        io.to(
            `organization:${organizationId}:project:${projectId}`
        ).emit("comment.updated", {
            comment: updatedComment,
        });

        return updatedComment;
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
                "You can only delete your own comments",
                403
            );
        }

        await db.transaction(async (tx) => {
            await tx.orm.public.Comment.where({ id: commentId }).delete();

            await tx.orm.public.AuditLog.create({
                action: "COMMENT_DELETED",
                entityType: "COMMENT",
                entityId: commentId,
                metadata: {
                    taskId,
                },
                projectId,
                createdByUserId: userId,
            });
        });

        const io = getIO();

        io.to(
            `organization:${organizationId}:project:${projectId}`
        ).emit("comment.deleted", {
            commentId,
            taskId,
        });
    },
};

export default commentService;