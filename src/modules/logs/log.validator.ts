import { z } from "zod";

export const createLogSchema = z.object({
    action: z.string()
        .trim()
        .min(1, "Action cannot be empty")
        .max(100, "Action cannot exceed 100 characters"),

    entityType: z.string()
        .trim()
        .min(1, "Entity type cannot be empty")
        .max(50, "Entity type cannot exceed 50 characters"),

    entityId: z.number()
        .int()
        .positive(),

    metadata: z.record(z.string(), z.unknown()).optional(),
});