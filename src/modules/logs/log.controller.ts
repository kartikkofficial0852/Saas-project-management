import type { Request, Response } from "express";
import logService from "./log.service.js";
import sendResponse from "../../utils/response.js";

const logController = {
    async create(req: Request, res: Response) {
        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);

        const {
            action,
            entityType,
            entityId,
            metadata,
        } = req.body;

        const log = await logService.create(
            action,
            entityType,
            entityId,
            metadata,
            organizationId,
            projectId,
            req.user!.id
        );

        sendResponse({
            res,
            statusCode: 201,
            message: "Activity log created successfully",
            data: {
                log,
            },
        });
    },

    async getAll(req: Request, res: Response) {
        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);

        const logs = await logService.getAll(
            organizationId,
            projectId
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Activity logs fetched successfully",
            data: {
                logs,
            },
        });
    },
};

export default logController;