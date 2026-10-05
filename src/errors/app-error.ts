class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    errors?: {
        field: string;
        message: string;
    }[];

    constructor(message: string, statusCode: number,
        errors?: {
            field: string;
            message: string;
        }[]) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = true;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;