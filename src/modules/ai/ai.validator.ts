import { z } from "zod";

export const generateTaskDescriptionSchema = z.object({
    title: z.string()
        .trim()
        .min(3, "Task title is too short")
        .max(200, "Task title cannot exceed 200 characters"),
});

export const taskBreakdownSchema = z.object({
    title: z.string()
        .trim()
        .min(3, "Task title is too short")
        .max(200, "Task title cannot exceed 200 characters"),

    description: z.string()
        .trim()
        .max(5000, "Task description cannot exceed 5000 characters")
        .optional(),
});

export const summarizeSchema = z.object({
    content: z.string()
        .trim()
        .min(10, "Content is too short to summarize")
        .max(
            10000,
            "Content cannot exceed 10000 characters"
        ),
});