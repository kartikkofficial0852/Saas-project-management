import type { Server, Socket } from "socket.io";
import AppError from "../errors/app-error.js";
import { db } from "../prisma/db.js";

const socketHandlers = (
    io: Server,
    socket: Socket
) => {
    const userRoom = `user:${socket.data.userId}`;

    socket.join(userRoom);

    socket.on(
        "join_project",
        async ({
            organizationId,
            projectId,
        }: {
            organizationId: number;
            projectId: number;
        }) => {
            try {
                const userId = socket.data.userId;

                const project =
                    await db.orm.public.Project
                        .where({
                            id: projectId,
                            organizationId,
                        })
                        .first();

                if (!project) {
                    throw new AppError(
                        "Project not found",
                        404
                    );
                }

                const membership =
                    await db.orm.public.OrganizationMember
                        .where({
                            organizationId,
                            userId,
                        })
                        .first();

                if (!membership) {
                    throw new AppError(
                        "You are not a member of this organization",
                        403
                    );
                }

                const room =
                    `organization:${organizationId}:project:${projectId}`;

                await socket.join(room);

                socket.emit(
                    "project_joined",
                    {
                        organizationId,
                        projectId,
                    }
                );
            } catch (error) {
                socket.emit("socket_error", {
                    message:
                        error instanceof Error
                            ? error.message
                            : "Unable to join project",
                });
            }
        }
    );

    socket.on(
        "leave_project",
        async ({
            organizationId,
            projectId,
        }: {
            organizationId: number;
            projectId: number;
        }) => {
            const room =
                `organization:${organizationId}:project:${projectId}`;

            await socket.leave(room);

            socket.emit(
                "project_left",
                {
                    organizationId,
                    projectId,
                }
            );
        }
    );
};

export default socketHandlers;