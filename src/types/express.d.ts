import { OrganizationMembership } from "./organization";
import { User } from "./user";

declare global {
    namespace Express {
        interface Request {
            user?: User;
            organizationMembership?: OrganizationMembership;
        }
    }
}