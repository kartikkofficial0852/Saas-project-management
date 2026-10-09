import { Request, Response } from "express";
import authService from "./auth.service.js";
import sendResponse from "../../utils/response.js";


const authController = {
    async register(req: Request, res: Response) {
        const { name, email, password } = req.body;

        const user = await authService.register(name, email, password);

        sendResponse({
            res,
            statusCode: 201,
            message: "User registered successfully",
            data: {
                user
            }
        })
    },

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const result = await authService.login(email, password);

        sendResponse({
            res,
            statusCode: 200,
            message: "Login successful",
            data: result,
        });
    },
    async me(req: Request, res: Response) {
        sendResponse({
            res,
            statusCode: 200,
            message: "User fetched successfully",
            data: {
                user: req.user,
            },
        });
    },
}


export default authController;