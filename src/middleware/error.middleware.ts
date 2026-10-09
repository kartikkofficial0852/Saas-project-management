// import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
// import AppError from "../errors/app-error.js";

// const errorMiddleware: ErrorRequestHandler = (
//     error: unknown,
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     if (error instanceof AppError) {

//         res.status(error.statusCode).json({
//             success: false,
//             message: error.message,
//             ...(error.errors && {
//                 errors: error.errors,
//             })
//         });

//         return;
//     }

//     res.status(500).json({
//         success: false,
//         message: "Internal server error",
//         error: error
//     });
// };

// export default errorMiddleware;


import type {
    ErrorRequestHandler,
    NextFunction,
    Request,
    Response,
} from "express";
import AppError from "../errors/app-error.js";

const errorMiddleware: ErrorRequestHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            ...(error.errors && {
                errors: error.errors,
            }),
        });

        return;
    }

    console.error("Unhandled request error:", error);

    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};

export default errorMiddleware;
