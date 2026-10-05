import AppError from "../../errors/app-error.js";
import { db } from "../../prisma/db.js";

const attachmentService = {
    async create(
        fileName: string,
        fileUrl: string,
        fileSize: number,
        mimeType: string,
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

        return await db.orm.public.Attachment.create({
            fileName,
            fileUrl,
            fileSize,
            mimeType,
            taskId,
            createdByUserId: userId,
        });
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

        return await db.orm.public.Attachment
            .where({ taskId })
            .all();
    },

    async getById(
        attachmentId: number,
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

        const attachment = await db.orm.public.Attachment
            .where({
                id: attachmentId,
                taskId,
            })
            .first();

        if (!attachment) {
            throw new AppError("Attachment not found", 404);
        }

        return attachment;
    },

    async delete(
        attachmentId: number,
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

        const attachment = await db.orm.public.Attachment
            .where({
                id: attachmentId,
                taskId,
            })
            .first();

        if (!attachment) {
            throw new AppError("Attachment not found", 404);
        }

        if (attachment.createdByUserId !== userId) {
            throw new AppError(
                "You can only delete your own attachments",
                403
            );
        }

        await db.orm.public.Attachment.where({ id: attachmentId }).delete();
    },
};

export default attachmentService;