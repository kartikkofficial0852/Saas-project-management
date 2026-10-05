export type OrganizationRole = "OWNER" | "ADMIN" | "MEMBER";

export type OrganizationMembership = {
    organizationId: number;
    userId: number;
    role: OrganizationRole;
};