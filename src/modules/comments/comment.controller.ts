import type { RequestHandler } from "express";
import commentService from "./comment.service.js";
import sendResponse from "../../utils/response.js";

const commentController = {
    create: (async (req, res) => {
        const user = req.user!;

        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);
        const taskId = Number(req.params.taskId);

        const { content } = req.body;

        const comment = await commentService.create(
            content,
            organizationId,
            projectId,
            taskId,
            user.id
        );

        sendResponse({
            res,
            statusCode: 201,
            message: "Comment created successfully",
            data: {
                comment,
            },
        });
    }) as RequestHandler,

    getAll: (async (req, res) => {
        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);
        const taskId = Number(req.params.taskId);

        const comments = await commentService.getAll(
            organizationId,
            projectId,
            taskId
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Comments fetched successfully",
            data: {
                comments,
            },
        });
    }) as RequestHandler,

    update: (async (req, res) => {
        const user = req.user!;

        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);
        const taskId = Number(req.params.taskId);
        const commentId = Number(req.params.commentId);

        const { content } = req.body;

        const comment = await commentService.update(
            commentId,
            organizationId,
            projectId,
            taskId,
            user.id,
            content
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Comment updated successfully",
            data: {
                comment,
            },
        });
    }) as RequestHandler,

    delete: (async (req, res) => {
        const user = req.user!;

        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);
        const taskId = Number(req.params.taskId);
        const commentId = Number(req.params.commentId);

        await commentService.delete(
            commentId,
            organizationId,
            projectId,
            taskId,
            user.id
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Comment deleted successfully",
        });
    }) as RequestHandler,
};

export default commentController;