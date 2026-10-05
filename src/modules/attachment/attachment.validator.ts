import { z } from "zod";

export const createAttachmentSchema = z.object({
    fileName: z.string()
        .trim()
        .min(1, "File name cannot be empty")
        .max(255, "File name cannot exceed 255 characters"),

    fileUrl: z.string()
        .trim()
        .url("Invalid file URL"),

    fileSize: z.number()
        .int()
        .positive(),

    mimeType: z.string()
        .trim()
        .min(1, "MIME type cannot be empty")
        .max(100, "MIME type cannot exceed 100 characters"),
});
