import type { Request, Response } from "express";
import projectService from "./project.service.js";
import sendResponse from "../../utils/response.js";

const projectController = {
    async create(req: Request, res: Response) {
        const { name, description } = req.body;

        const organizationId =
            Number(req.params.organizationId);

        const project = await projectService.create(
            name,
            description,
            organizationId,
            req.user!.id
        );

        sendResponse({
            res,
            statusCode: 201,
            message: "Project created successfully",
            data: {
                project,
            },
        });
    },

    async getAll(req: Request, res: Response) {
        const organizationId =
            Number(req.params.organizationId);

        const projects =
            await projectService.getAll(organizationId);

        sendResponse({
            res,
            statusCode: 200,
            message: "Projects fetched successfully",
            data: {
                projects,
            },
        });
    },

    async getById(req: Request, res: Response) {
        const organizationId =
            Number(req.params.organizationId);

        const projectId =
            Number(req.params.projectId);

        const project =
            await projectService.getById(
                organizationId,
                projectId
            );

        sendResponse({
            res,
            statusCode: 200,
            message: "Project fetched successfully",
            data: {
                project,
            },
        });
    },

    async update(req: Request, res: Response) {
        const organizationId =
            Number(req.params.organizationId);

        const projectId =
            Number(req.params.projectId);

        const project =
            await projectService.update(
                organizationId,
                projectId,
                req.body,
                req.user!.id
            );

        sendResponse({
            res,
            statusCode: 200,
            message: "Project updated successfully",
            data: {
                project,
            },
        });
    },

    async delete(req: Request, res: Response) {
        const organizationId =
            Number(req.params.organizationId);

        const projectId =
            Number(req.params.projectId);

        await projectService.delete(
            organizationId,
            projectId
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Project deleted successfully",
        });
    }
};

export default projectController;