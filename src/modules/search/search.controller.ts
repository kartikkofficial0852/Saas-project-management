import type { RequestHandler } from "express";
import sendResponse from "../../utils/response.js";
import searchService from "./search.service.js";
import { searchSchema } from "./search.validator.js";

const searchController: {
    search: RequestHandler;
} = {
    async search(req, res) {
        const { q } = searchSchema.parse(req.query);

        const organizationId = Number(
            req.params.organizationId
        );

        const results = await searchService.search(
            organizationId,
            q
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Search results fetched successfully",
            data: results,
        });
    },
};

export default searchController;