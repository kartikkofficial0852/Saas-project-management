import type { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import AppError from "../errors/app-error.js";

const JWT_SECRET = process.env.JWT_SECRET!;

const socketAuthMiddleware = (
    socket: Socket,
    next: (err?: Error) => void
) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(
                new AppError(
                    "Authentication required",
                    401
                )
            );
        }

        const payload = jwt.verify(
            token,
            JWT_SECRET
        );

        if (
            typeof payload === "string" ||
            typeof payload.sub !== "number"
        ) {
            return next(
                new AppError(
                    "Invalid token",
                    401
                )
            );
        }

        socket.data.userId = payload.sub;

        next();
    } catch {
        next(
            new AppError(
                "Invalid or expired token",
                401
            )
        );
    }
};

export default socketAuthMiddleware;