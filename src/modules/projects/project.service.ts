import AppError from "../../errors/app-error.js";
import { db } from "../../prisma/db.js";
import cacheService from '../../services/cache.service.js'
import { ProjectModel } from "../../types/models.js";

const projectService = {
    async create(
        name: string,
        description: string | undefined,
        organizationId: number,
        userId: number
    ) {
        const project = await db.transaction(async (tx) => {
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

        await cacheService.delete(
            `organization:${organizationId}:projects`
        );

        await cacheService.delete(
            `organization:${organizationId}:dashboard`
        );

        return project;
    },

    async getAll(organizationId: number) {
        const cacheKey =
            `organization:${organizationId}:projects`;

        const cachedProjects = await cacheService.get<ProjectModel[]>(cacheKey);

        if (cachedProjects) {
            return cachedProjects;
        }

        const projects = await db.orm.public.Project
            .where({
                organizationId,
            })
            .all();

        await cacheService.set(cacheKey, projects, 60 * 5); // Cache for 5 minutes

        return projects;
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

        const updatedProject = await db.transaction(async (tx) => {
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
        });

        await cacheService.delete(
            `organization:${organizationId}:projects`
        );

        await cacheService.delete(
            `organization:${organizationId}:dashboard`
        );

        return updatedProject;

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

        await cacheService.delete(
            `organization:${organizationId}:projects`
        );

        await cacheService.delete(
            `organization:${organizationId}:dashboard`
        );
    }
};

export default projectService;