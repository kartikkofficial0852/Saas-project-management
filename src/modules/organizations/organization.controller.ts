import { Request, Response } from "express";
import organizationService from "./organization.service.js";
import sendResponse from "../../utils/response.js";


const organizationController = {
    async create(req: Request, res: Response) {
        const user = req.user!;
        const { name } = req.body;

        const organization = await organizationService.create(name, user.id);

        sendResponse({
            res,
            statusCode: 201,
            message: "Organization created successfully",
            data: {
                organization
            }
        })
    },

    async addMember(req: Request, res: Response) {
        const organizationId = Number(req.params.organizationId);
        const { userId } = req.body;

        const membership =
            await organizationService.addMember(
                organizationId,
                userId,
            );

        sendResponse({
            res,
            statusCode: 201,
            message: "Member added successfully",
            data: {
                membership,
            },
        });
    },

    async getMembers(req: Request, res: Response) {
        const organizationId = Number(req.params.organizationId);

        const members = await organizationService.getMembers(organizationId);

        sendResponse({
            res,
            statusCode: 200,
            message: "Organization members fetched successfully",
            data: {
                members: members
            }
        })
    },
    async updateMemberRole(req: Request, res: Response) {
        const organizationId =
            Number(req.params.organizationId);

        const userId =
            Number(req.params.userId);

        const { role } = req.body;

        const membership =
            await organizationService.updateMemberRole(
                organizationId,
                userId,
                role
            );

        sendResponse({
            res,
            statusCode: 200,
            message: "Member role updated successfully",
            data: {
                membership,
            },
        });
    },
    async removeMember(req: Request, res: Response) {
        const organizationId =
            Number(req.params.organizationId);

        const userId =
            Number(req.params.userId);

        await organizationService.removeMember(
            organizationId,
            userId
        );

        sendResponse({
            res,
            statusCode: 200,
            message: "Member removed successfully",
        });
    },
}

export default organizationController;