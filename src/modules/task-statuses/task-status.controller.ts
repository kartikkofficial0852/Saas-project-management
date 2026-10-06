import type { Request, Response } from "express";
import taskStatusService from "./task-status.service.js";
import sendResponse from "../../utils/response.js";

const taskStatusController = {
    async create(req: Request, res: Response) {
        const organizationId =
            Number(req.params.organizationId);

        const projectId =
            Number(req.params.projectId);

        const {
            name,
            position,
        } = req.body;

        const status =
            await taskStatusService.create(
                name,
                position,
                organizationId,
                projectId,
                req.user!.id
            );

        sendResponse({
            res,
            statusCode: 201,
            message: "Task status created successfully",
            data: {
                status,
            },
        });
    },

    async getAll(req: Request, res: Response) {
        const organizationId =
            Number(req.params.organizationId);

        const projectId =
            Number(req.params.projectId);

        const statuses =
            await taskStatusService.getAll(
                organizationId,
                projectId
            );

        sendResponse({
            res,
            statusCode: 200,
            message: "Task statuses fetched successfully",
            data: {
                statuses,
            },
        });
    },

    async update(req: Request, res: Response) {
        const organizationId =
            Number(req.params.organizationId);

        const projectId =
            Number(req.params.projectId);

        const statusId =
            Number(req.params.statusId);

        const {
            name,
            position,
        } = req.body;

        const status =
            await taskStatusService.update(
                statusId,
                name,
                position,
                organizationId,
                projectId,
                req.user!.id
            );

        sendResponse({
            res,
            statusCode: 200,
            message: "Task status updated successfully",
            data: {
                status,
            },
        });
    },

    async delete(req: Request, res: Response) {
        const organizationId =
            Number(req.params.organizationId);

        const projectId =
            Number(req.params.projectId);

        const statusId =
            Number(req.params.statusId);

        await taskStatusService.delete(
            statusId,
            organizationId,
            projectId
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Task status deleted successfully",
        });
    },
};

export default taskStatusController;