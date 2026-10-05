import type { Request, Response } from "express";
import attachmentService from "./attachment.service.js";
import sendResponse from "../../utils/response.js";

const attachmentController = {
    async create(req: Request, res: Response) {
        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);
        const taskId = Number(req.params.taskId);

        const {
            fileName,
            fileUrl,
            fileSize,
            mimeType,
        } = req.body;

        const attachment = await attachmentService.create(
            fileName,
            fileUrl,
            fileSize,
            mimeType,
            organizationId,
            projectId,
            taskId,
            req.user!.id
        );

        sendResponse({
            res,
            statusCode: 201,
            message: "Attachment created successfully",
            data: {
                attachment,
            },
        });
    },

    async getAll(req: Request, res: Response) {
        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);
        const taskId = Number(req.params.taskId);

        const attachments = await attachmentService.getAll(
            organizationId,
            projectId,
            taskId
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Attachments fetched successfully",
            data: {
                attachments,
            },
        });
    },

    async getById(req: Request, res: Response) {
        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);
        const taskId = Number(req.params.taskId);
        const attachmentId = Number(req.params.attachmentId);

        const attachment = await attachmentService.getById(
            attachmentId,
            organizationId,
            projectId,
            taskId
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Attachment fetched successfully",
            data: {
                attachment,
            },
        });
    },

    async delete(req: Request, res: Response) {
        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);
        const taskId = Number(req.params.taskId);
        const attachmentId = Number(req.params.attachmentId);

        await attachmentService.delete(
            attachmentId,
            organizationId,
            projectId,
            taskId,
            req.user!.id
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Attachment deleted successfully",
        });
    },
};

export default attachmentController;