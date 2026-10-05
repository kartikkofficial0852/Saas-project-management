import { JsonValue } from "@prisma/orm-postgres/contract";
import AppError from "../../errors/app-error.js";
import { db } from "../../prisma/db.js";

const notificationService = {
    async create(
        type: string,
        message: string,
        entityType: string,
        entityId: number,
        userId: number,
        metadata?: JsonValue
    ) {
        return await db.orm.public.Notification.create({
            type,
            message,
            entityType,
            entityId,
            userId,
            metadata,
        });
    },
    async getAll(userId: number) {
        return await db.orm.public.Notification
            .where({ userId })
            .all();
    },

    async markAsRead(
        notificationId: number,
        userId: number
    ) {
        const notification = await db.orm.public.Notification
            .where({
                id: notificationId,
                userId,
            })
            .first();

        if (!notification) {
            throw new AppError(
                "Notification not found",
                404
            );
        }

        return await db.orm.public.Notification.where({ id: notificationId }).update({
            isRead: true,
        });
    },

    async markAllAsRead(userId: number) {
        const notifications = await db.orm.public.Notification
            .where({
                userId,
                isRead: false,
            })
            .all();

        for (const notification of notifications) {
            await db.orm.public.Notification.where({ id: notification.id }).update({
                isRead: true,
            });
        }
    },

    async delete(
        notificationId: number,
        userId: number
    ) {
        const notification = await db.orm.public.Notification
            .where({
                id: notificationId,
                userId,
            })
            .first();

        if (!notification) {
            throw new AppError(
                "Notification not found",
                404
            );
        }

        await db.orm.public.Notification.where({ id: notificationId }).delete();
    },
};

export default notificationService;