import { z } from "zod";

export const createLabelSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Label name cannot be empty")
        .max(50, "Label name cannot exceed 50 characters"),
});

export const updateLabelSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Label name cannot be empty")
        .max(50, "Label name cannot exceed 50 characters"),
});

export const taskLabelSchema = z.object({
    labelId: z.number()
        .int()
        .positive(),
});