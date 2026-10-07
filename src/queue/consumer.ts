import { getChannel } from "./connection.js";
import { QUEUE_EVENTS } from "./events.js";
import { getIO } from "../socket/socket.js";
import notificationService from "../modules/notifications/notification.services.js";
import { db } from "../prisma/db.js";

type TaskAssignedEvent = {
    taskId: number;
    taskTitle: string;
    assignedToUserId: number;
    assignedByUserId: number;
};

export const startConsumers = async () => {
    const channel = getChannel();

    const queue = "notification.queue";

    await channel.assertQueue(queue, {
        durable: true,
    });

    await channel.bindQueue(
        queue,
        "saas.events",
        QUEUE_EVENTS.TASK_ASSIGNED
    );

    await channel.consume(queue, async (message) => {
        if (!message) {
            return;
        }

        try {
            const eventId =
                message.properties.messageId;

            if (!eventId) {
                throw new Error(
                    "RabbitMQ message is missing messageId"
                );
            }

            const event =
                JSON.parse(
                    message.content.toString()
                ) as TaskAssignedEvent;

            const result = await db.transaction(
                async (tx) => {
                    const existingEvent =
                        await tx.orm.public.ProcessedEvent
                            .where({
                                eventId,
                            })
                            .first();

                    if (existingEvent) {
                        return {
                            duplicate: true,
                            notification: null,
                        };
                    }

                    const notification =
                        await tx.orm.public.Notification.create({
                            type: "TASK_ASSIGNED",
                            message:
                                `You have been assigned a task: ${event.taskTitle}`,
                            entityType: "TASK",
                            entityId: event.taskId,
                            userId:
                                event.assignedToUserId,
                            metadata: {
                                assignedByUserId:
                                    event.assignedByUserId,
                            },
                        });

                    await tx.orm.public.ProcessedEvent.create({
                        eventId,
                        eventType:
                            QUEUE_EVENTS.TASK_ASSIGNED,
                    });

                    return {
                        duplicate: false,
                        notification,
                    };
                }
            );

            channel.ack(message);

            if (
                !result.duplicate &&
                result.notification
            ) {
                getIO()
                    .to(
                        `user:${event.assignedToUserId}`
                    )
                    .emit("notification.created", {
                        notification:
                            result.notification,
                    });
            }
        } catch (error) {
            console.error(
                "Notification consumer error:",
                error
            );

            channel.nack(
                message,
                false,
                false
            );
        }
    });

    console.log(
        "RabbitMQ notification consumer started"
    );
};