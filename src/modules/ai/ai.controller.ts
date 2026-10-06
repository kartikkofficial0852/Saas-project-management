import type { Request, RequestHandler, Response } from "express";
import sendResponse from "../../utils/response.js";
import aiService from "./ai.service.js";

const aiController = {

    async generateTaskDescription(req: Request, res: Response) {
        const { title } = req.body;

        const description =
            await aiService.generateTaskDescription(
                title
            );

        sendResponse({
            res,
            statusCode: 200,
            message:
                "Task description generated successfully",
            data: {
                description,
            },
        });
    },

    async generateTaskBreakdown(req: Request, res: Response) {
        const { title, description } =
            req.body;

        const breakdown =
            await aiService.generateTaskBreakdown(
                title,
                description
            );

        sendResponse({
            res,
            statusCode: 200,
            message: "Task breakdown generated successfully",
            data: {
                breakdown,
            },
        });
    },

    async summarize(req: Request, res: Response) {
        const { content } = req.body;

        const summary =
            await aiService.summarize(content);

        sendResponse({
            res,
            statusCode: 200,
            message: "Content summarized successfully",
            data: {
                summary,
            },
        });
    },
};

export default aiController;