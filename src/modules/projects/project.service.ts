import AppError from "../../errors/app-error.js";
import { db } from "../../prisma/db.js";

const projectService = {
    async create(
        name: string,
        description: string | undefined,
        organizationId: number,
        userId: number
    ) {
        return await db.transaction(async (tx) => {
            const project =
                await tx.orm.public.Project.create({
                    name,
                    description,
                    organizationId,
                    createdByUserId: userId,
                });

            const defaultStatuses = [
                {
                    name: "TODO",
                    position: 0,
                },
                {
                    name: "IN PROGRESS",
                    position: 1,
                },
                {
                    name: "DONE",
                    position: 2,
                },
            ];

            for (const status of defaultStatuses) {
                await tx.orm.public.TaskStatus.create({
                    name: status.name,
                    position: status.position,
                    projectId: project.id,
                });
            }

            await tx.orm.public.AuditLog.create({
                action: "PROJECT_CREATED",
                entityType: "PROJECT",
                entityId: project.id,
                projectId: project.id,
                createdByUserId: userId,
            });

            return project;
        });
    },

    async getAll(organizationId: number) {
        return await db.orm.public.Project
            .where({
                organizationId,
            })
            .all();
    },

    async getById(
        organizationId: number,
        projectId: number
    ) {
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

        return project;
    },

    async update(
        organizationId: number,
        projectId: number,
        data: {
            name?: string;
            description?: string | null;
        },
        userId: number
    ) {
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

        return await db.transaction(async (tx) => {
            const updatedProject =
                await tx.orm.public.Project.where({ id: project.id }).update(
                    data
                );

            await tx.orm.public.AuditLog.create({
                action: "PROJECT_UPDATED",
                entityType: "PROJECT",
                entityId: projectId,
                metadata: {
                    nameChanged: data.name !== undefined,
                    descriptionChanged:
                        data.description !== undefined,
                },
                projectId,
                createdByUserId: userId,
            });

            return updatedProject;
        })

    },

    async delete(
        organizationId: number,
        projectId: number
    ) {
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

        await db.orm.public.Project.where({ id: project.id }).delete();
    }
};

export default projectService;