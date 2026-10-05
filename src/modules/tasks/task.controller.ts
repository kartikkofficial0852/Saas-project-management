import type { RequestHandler } from "express";
import taskService from "./task.services";
import sendResponse from "../../utils/response";

const taskController = {
    create: (async (req, res) => {
        const user = req.user!;

        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);

        const {
            title,
            description,
            statusId,
            assignedToUserId,
        } = req.body;

        const task = await taskService.create(
            title,
            description,
            statusId,
            assignedToUserId,
            organizationId,
            projectId,
            user.id
        );

        sendResponse({
            res,
            statusCode: 201,
            message: "Task created successfully",
            data: task,
        });
    }) as RequestHandler,

    getAll: (async (req, res) => {
        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);

        const tasks = await taskService.getAll(
            organizationId,
            projectId
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Tasks fetched successfully",
            data: {
                tasks
            },
        });
    }) as RequestHandler,

    getOne: (async (req, res) => {
        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);
        const taskId = Number(req.params.taskId);

        const task = await taskService.getOne(
            organizationId,
            projectId,
            taskId
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Task fetched successfully",
            data: {
                task
            },
        });
    }) as RequestHandler,

    update: (async (req, res) => {
        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);
        const taskId = Number(req.params.taskId);

        const {
            title,
            description,
            statusId,
            assignedToUserId,
        } = req.body;

        const task = await taskService.update(
            taskId,
            projectId,
            organizationId,
            title,
            description,
            statusId,
            assignedToUserId
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Task updated successfully",
            data: {
                task
            },
        });
    }) as RequestHandler,

    delete: (async (req, res) => {
        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);
        const taskId = Number(req.params.taskId);

        await taskService.delete(
            taskId,
            projectId,
            organizationId
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Task deleted successfully",
        });
    }) as RequestHandler,

    updateAssignee: (async (req, res) => {
        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);
        const taskId = Number(req.params.taskId);

        const { assignedToUserId } = req.body;

        const task = await taskService.updateAssignee(
            taskId,
            projectId,
            organizationId,
            assignedToUserId,
            req.user!.id
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Task assignee updated successfully",
            data: {
                task,
            },
        });
    }) as RequestHandler,

    updateStatus: (async (req, res) => {
        const organizationId = Number(req.params.organizationId);
        const projectId = Number(req.params.projectId);
        const taskId = Number(req.params.taskId);

        const { statusId } = req.body;

        const task = await taskService.updateStatus(
            taskId,
            projectId,
            organizationId,
            statusId,
            req.user!.id
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Task status updated successfully",
            data: {
                task,
            },
        });
    }) as RequestHandler,
};

export default taskController;