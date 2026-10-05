import type { Request, Response } from "express";
import sendResponse from "../../utils/response.js";
import notificationService from "./notification.services.js";

const notificationController = {
    async getAll(req: Request, res: Response) {
        const notifications =
            await notificationService.getAll(
                req.user!.id
            );

        sendResponse({
            res,
            statusCode: 200,
            message: "Notifications fetched successfully",
            data: {
                notifications,
            },
        });
    },

    async markAsRead(req: Request, res: Response) {
        const notificationId =
            Number(req.params.notificationId);

        const notification =
            await notificationService.markAsRead(
                notificationId,
                req.user!.id
            );

        sendResponse({
            res,
            statusCode: 200,
            message: "Notification marked as read",
            data: {
                notification,
            },
        });
    },

    async markAllAsRead(req: Request, res: Response) {
        await notificationService.markAllAsRead(
            req.user!.id
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "All notifications marked as read",
        });
    },

    async delete(req: Request, res: Response) {
        const notificationId =
            Number(req.params.notificationId);

        await notificationService.delete(
            notificationId,
            req.user!.id
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Notification deleted successfully",
        });
    },
};

export default notificationController;