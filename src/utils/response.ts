import { Response } from "express"


interface ApiResponseOption<T> {
    res: Response,
    statusCode: number,
    message: string,
    data?: T
}

const sendResponse = <T>({
    res,
    statusCode,
    message,
    data
}: ApiResponseOption<T>) => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    })
}

export default sendResponse;