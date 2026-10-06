import { JsonValue } from "@prisma/orm-postgres/contract";
import AppError from "../../errors/app-error.js";
import { db } from "../../prisma/db.js";
import cacheService from "../../services/cache.service.js";
import { NotificationModel } from "../../types/models.js";


const getNotificationsCacheKey = (userId: number) => `user:${userId}:notifications`;

const notificationService = {
    async create(
        type: string,
        message: string,
        entityType: string,
        entityId: number,
        userId: number,
        metadata?: JsonValue
    ) {
        const notification = await db.orm.public.Notification.create({
            type,
            message,
            entityType,
            entityId,
            userId,
            metadata,
        });

        await cacheService.delete(
            getNotificationsCacheKey(userId)
        );

        return notification;
    },
    async getAll(userId: number) {

        const cacheKey = getNotificationsCacheKey(userId);
        const cachedNotifications = await cacheService.get<NotificationModel[]>(cacheKey);

        if (cachedNotifications) {
            return cachedNotifications;
        }

        const notifications = await db.orm.public.Notification
            .where({ userId })
            .all();

        await cacheService.set(
            cacheKey,
            notifications,
            60 * 5 // Cache for 5 minutes
        );

        return notifications;
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

        const updatedNotification = await db.orm.public.Notification.where({ id: notificationId }).update({
            isRead: true,
        });

        await cacheService.delete(
            getNotificationsCacheKey(userId)
        );

        return updatedNotification;
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

        await cacheService.delete(
            getNotificationsCacheKey(userId)
        );
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

        await cacheService.delete(
            getNotificationsCacheKey(userId)
        );
    },
};

export default notificationService;