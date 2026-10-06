import type { RequestHandler } from "express";
import { z } from "zod";
import AppError from "../errors/app-error.js";

const queryValidationMiddleware = (
    schema: z.ZodType
): RequestHandler => {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            throw new AppError(
                "Validation failed",
                400,
                errors
            );
        }

        next();
    };
};

export default queryValidationMiddleware;