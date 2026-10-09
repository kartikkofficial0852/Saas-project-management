import AppError from "../../errors/app-error.js";
import { db } from "../../prisma/db.js"


const organizationService = {
    async create(name: string, userId: number) {

        return await db.transaction(async (tx) => {
            const organization = await tx.orm.public.Organization.create({
                name
            });

            await tx.orm.public.OrganizationMember.create({
                userId,
                organizationId: organization.id,
                role: "OWNER"
            });

            return organization;
        })
    },
    async addMember(
        organizationId: number,
        userId: number,
    ) {
        const user =
            await db.orm.public.User
                .where({
                    id: userId,
                })
                .first();

        if (!user) {
            throw new AppError(
                "User not found",
                404
            );
        }

        const existingMembership =
            await db.orm.public.OrganizationMember
                .where({
                    organizationId,
                    userId,
                })
                .first();

        if (existingMembership) {
            throw new AppError(
                "User is already a member of this organization",
                409
            );
        }

        return await db.orm.public.OrganizationMember.create({
            organizationId,
            userId,
            role: "MEMBER",
        });
    },

    async getMembers(organizationId: number) {

        const existingOrganization = await db.orm.public.Organization.where({ id: organizationId }).first();

        if (!existingOrganization) {
            throw new AppError("Organization not found", 409);
        }

        const members = await db.orm.public.OrganizationMember.where({ organizationId }).include('user', (u) => u.select('id', 'name', 'email')).select('role').all();

        return members;
    },

    async updateMemberRole(
        organizationId: number,
        userId: number,
        role: "ADMIN" | "MEMBER"
    ) {
        const membership =
            await db.orm.public.OrganizationMember
                .where({
                    organizationId,
                    userId,
                })
                .first();

        if (!membership) {
            throw new AppError(
                "Organization member not found",
                404
            );
        }

        if (membership.role === "OWNER") {
            throw new AppError(
                "Owner role cannot be changed",
                400
            );
        }

        return await db.orm.public.OrganizationMember.where({ id: membership.id }).update({ role });
    },

    async removeMember(
        organizationId: number,
        userId: number
    ) {
        const membership =
            await db.orm.public.OrganizationMember
                .where({
                    organizationId,
                    userId,
                })
                .first();

        if (!membership) {
            throw new AppError(
                "Organization member not found",
                404
            );
        }

        if (membership.role === "OWNER") {
            throw new AppError(
                "Organization owner cannot be removed",
                400
            );
        }

        await db.orm.public.OrganizationMember.where({ id: membership.id }).delete();
    }
}

export default organizationService;