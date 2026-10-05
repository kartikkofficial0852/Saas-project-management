import { z } from 'zod';

const createOrganizationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Organization name must be at least 2 characters")
        .max(100, "Organization name cannot exceed 100 characters"),
})

const addMemberSchema = z.object({
    userId: z.number().int().positive(),
});

const updateMemberRoleSchema = z.object({
    role: z.enum(["ADMIN", "MEMBER"]),
});

export { createOrganizationSchema, addMemberSchema, updateMemberRoleSchema }