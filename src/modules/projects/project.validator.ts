import { z } from "zod";

export const createProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Project name must be at least 2 characters")
        .max(100, "Project name cannot exceed 100 characters"),

    description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),
});

export const updateProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .optional(),

    description: z
        .string()
        .trim()
        .max(500)
        .nullable()
        .optional(),
});
