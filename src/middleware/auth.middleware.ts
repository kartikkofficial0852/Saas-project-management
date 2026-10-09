import { RequestHandler } from "express";
import AppError from "../errors/app-error.js";
import jwt from "jsonwebtoken";
import { db } from "../prisma/db.js";

const JWT_SECRET = process.env.JWT_SECRET!;

const authMiddleware: RequestHandler = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        throw new AppError(
            "Authentication required",
            401
        );
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
        throw new AppError(
            "Invalid authorization format",
            401
        );
    }

    try {
        const payload = jwt.verify(
            token,
            JWT_SECRET
        );

        if (
            typeof payload === "string" ||
            typeof payload.sub !== "number"
        ) {
            throw new AppError(
                "Invalid token",
                401
            );
        }

        const user = await db.orm.public.User.where({ id: payload.sub }).first();

        if (!user) {
            throw new AppError(
                "User not found",
                401
            );
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        next();
    } catch {
        throw new AppError(
            "Invalid or expired token",
            401
        );
    }
}

export default authMiddleware;