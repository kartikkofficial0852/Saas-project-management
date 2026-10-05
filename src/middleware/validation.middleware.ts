
import type { RequestHandler } from "express";
import { z } from "zod";
import AppError from "../errors/app-error.js";

const validationMiddleware = (
    schema: z.ZodType
): RequestHandler => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            throw new AppError(
                "Invalid request data",
                400,
                errors
            );
        }

        req.body = result.data;

        next();
    };
};

export default validationMiddleware;