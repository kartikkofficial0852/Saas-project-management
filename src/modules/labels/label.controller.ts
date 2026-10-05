import type { RequestHandler } from "express";
import labelService from "./label.service.js";
import sendResponse from "../../utils/response.js";

const labelController = {
    create: (async (req, res) => {
        const organizationId =
            Number(req.params.organizationId);

        const projectId =
            Number(req.params.projectId);

        const { name } = req.body;

        const label = await labelService.create(
            name,
            organizationId,
            projectId,
            req.user!.id
        );

        sendResponse({
            res,
            statusCode: 201,
            message: "Label created successfully",
            data: {
                label,
            },
        });
    }) as RequestHandler,

    getAll: (async (req, res) => {
        const organizationId =
            Number(req.params.organizationId);

        const projectId =
            Number(req.params.projectId);

        const labels = await labelService.getAll(
            organizationId,
            projectId
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Labels fetched successfully",
            data: {
                labels,
            },
        });
    }) as RequestHandler,

    update: (async (req, res) => {
        const organizationId =
            Number(req.params.organizationId);

        const projectId =
            Number(req.params.projectId);

        const labelId =
            Number(req.params.labelId);

        const { name } = req.body;

        const label = await labelService.update(
            labelId,
            name,
            organizationId,
            projectId,
            req.user!.id
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Label updated successfully",
            data: {
                label,
            },
        });
    }) as RequestHandler,

    delete: (async (req, res) => {
        const organizationId =
            Number(req.params.organizationId);

        const projectId =
            Number(req.params.projectId);

        const labelId =
            Number(req.params.labelId);

        await labelService.delete(
            labelId,
            organizationId,
            projectId
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Label deleted successfully",
        });
    }) as RequestHandler,

    addToTask: (async (req, res) => {
        const organizationId =
            Number(req.params.organizationId);

        const projectId =
            Number(req.params.projectId);

        const taskId =
            Number(req.params.taskId);

        const { labelId } = req.body;

        const taskLabel =
            await labelService.addToTask(
                labelId,
                organizationId,
                projectId,
                taskId,
                req.user!.id
            );

        sendResponse({
            res,
            statusCode: 201,
            message: "Label added to task successfully",
            data: {
                taskLabel,
            },
        });
    }) as RequestHandler,

    removeFromTask: (async (req, res) => {
        const organizationId =
            Number(req.params.organizationId);

        const projectId =
            Number(req.params.projectId);

        const taskId =
            Number(req.params.taskId);

        const labelId =
            Number(req.params.labelId);

        await labelService.removeFromTask(
            labelId,
            organizationId,
            projectId,
            taskId,
            req.user!.id
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Label removed from task successfully",
        });
    }) as RequestHandler,
};

export default labelController;