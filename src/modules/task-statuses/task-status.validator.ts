import { z } from "zod";

export const createTaskStatusSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Status name cannot be empty")
        .max(50, "Status name cannot exceed 50 characters"),

    position: z.number()
        .int()
        .min(0),
});

export const updateTaskStatusSchema = z
    .object({
        name: z.string()
            .trim()
            .min(1, "Status name cannot be empty")
            .max(50, "Status name cannot exceed 50 characters")
            .optional(),

        position: z.number()
            .int()
            .min(0)
            .optional(),
    })
    .refine(
        (data) =>
            data.name != undefined ||
            data.position != undefined,
        {
            message: "At least one field is required",
        }
    );