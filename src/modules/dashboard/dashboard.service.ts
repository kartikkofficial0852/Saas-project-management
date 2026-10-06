import { db } from "../../prisma/db.js";
import cacheService from "../../services/cache.service.js";

const dashboardService = {
    async getDashboard(organizationId: number) {

        const cacheKey =
            `organization:${organizationId}:dashboard`;

        const cachedDashboard =
            await cacheService.get(cacheKey);

        if (cachedDashboard) {
            return cachedDashboard;
        }

        const projects =
            await db.orm.public.Project
                .where({ organizationId })
                .all();

        const projectIds = projects.map(
            (project) => project.id
        );

        if (projectIds.length === 0) {
            return {
                totalProjects: 0,
                totalTasks: 0,
                completedTasks: 0,
                assignedTasks: 0,
                unassignedTasks: 0,
                tasksByStatus: [],
            };
        }

        const tasks =
            await db.orm.public.Task
                .where((task) =>
                    task.projectId.in(projectIds)
                )
                .all();

        const statuses =
            await db.orm.public.TaskStatus
                .where((status) =>
                    status.projectId.in(projectIds)
                )
                .all();

        const tasksByStatus = statuses.map(
            (status) => ({
                statusId: status.id,
                status: status.name,
                count: tasks.filter(
                    (task) =>
                        task.statusId === status.id
                ).length,
            })
        );

        const completedStatuses =
            statuses.filter(
                (status) =>
                    status.name === "DONE"
            );

        const completedStatusIds =
            new Set(
                completedStatuses.map(
                    (status) => status.id
                )
            );

        const completedTasks = tasks.filter(
            (task) =>
                completedStatusIds.has(
                    task.statusId
                )
        ).length;

        const assignedTasks = tasks.filter(
            (task) =>
                task.assignedToUserId !== null
        ).length;

        const data = {
            totalProjects: projects.length,
            totalTasks: tasks.length,
            completedTasks,
            assignedTasks,
            unassignedTasks:
                tasks.length - assignedTasks,
            tasksByStatus,
        };

        await cacheService.set(cacheKey, data, 60 * 5);

        return data;
    },
};

export default dashboardService;
