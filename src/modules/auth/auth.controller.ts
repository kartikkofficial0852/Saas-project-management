import { Request, Response } from "express";
import authService from "./auth.service.js";
import sendResponse from "../../utils/response.js";


const authController = {

    async register(req: Request, res: Response) {
        const { name, email, password, organizationName } = req.body;

        const result = await authService.register(
            name,
            email,
            password,
            organizationName
        );

        sendResponse({
            res,
            statusCode: 201,
            message: "User and organization registered successfully",
            data: result,
        });
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