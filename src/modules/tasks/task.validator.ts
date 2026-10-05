
import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string()
        .trim()
        .min(2, "Task title must be at least 2 characters")
        .max(200, "Task title cannot exceed 200 characters"),

    description: z.string()
        .trim()
        .max(1000, "Task description cannot exceed 1000 characters")
        .optional(),

    statusId: z.number()
        .int()
        .positive(),

    assignedToUserId: z.number()
        .int()
        .positive()
        .optional(),
});

export const updateTaskSchema = z.object({
    title: z.string()
        .trim()
        .min(2, "Task title must be at least 2 characters")
        .max(200, "Task title cannot exceed 200 characters")
        .optional(),

    description: z.string()
        .trim()
        .max(1000, "Task description cannot exceed 1000 characters")
        .nullable()
        .optional(),

    statusId: z.number()
        .int()
        .positive()
        .optional(),

    assignedToUserId: z.number()
        .int()
        .positive()
        .nullable()
        .optional(),
});

export const updateTaskAssigneeSchema = z.object({
    assignedToUserId: z.number()
        .int()
        .positive()
        .nullable(),
});

export const updateTaskStatusSchema = z.object({
    statusId: z.number()
        .int()
        .positive(),
});