import type { RequestHandler } from "express";
import sendResponse from "../../utils/response.js";
import dashboardService from "./dashboard.service.js";

const dashboardController: {
    getDashboard: RequestHandler;
} = {
    async getDashboard(req, res) {
        const organizationId = Number(
            req.params.organizationId
        );

        const dashboard =
            await dashboardService.getDashboard(
                organizationId
            );

        sendResponse({
            res,
            statusCode: 200,
            message: "Dashboard fetched successfully",
            data: {
                dashboard,
            },
        });
    },
};

export default dashboardController;