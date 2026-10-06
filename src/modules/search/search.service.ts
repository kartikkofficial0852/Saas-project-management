import { db } from "../../prisma/db.js";

const searchService = {
    async search(
        organizationId: number,
        query: string
    ) {
        const projects =
            await db.orm.public.Project
                .where({
                    organizationId,
                })
                .where((project) =>
                    project.name.like(`%${query}%`)
                )
                .limit(10)
                .all();

        const tasks =
            await db.orm.public.Task
                .where((task) =>
                    task.project.some((project) =>
                        project.organizationId.eq(
                            organizationId
                        )
                    )
                )
                .where((task) =>
                    task.title.like(`%${query}%`)
                )
                .limit(20)
                .all();

        const comments =
            await db.orm.public.Comment
                .where((comment) =>
                    comment.task.some((task) =>
                        task.project.some((project) =>
                            project.organizationId.eq(organizationId)))
                )
                .where((comment) =>
                    comment.content.like(`%${query}%`)
                )
                .limit(20)
                .all();

        return {
            projects,
            tasks,
            comments,
        };
    },
};

export default searchService;