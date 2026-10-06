

export type UserModel = {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
};


// Organization

export type OrganizationModel = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
};


// Organization Member

export type OrganizationMemberModel = {
    id: number;
    userId: number;
    organizationId: number;
    role: "OWNER" | "ADMIN" | "MEMBER";
};


// Project

export type ProjectModel = {
    id: number;
    name: string;
    description: string | null;
    organizationId: number;
    createdByUserId: number;
    createdAt: Date;
    updatedAt: Date;
};


// Task

export type TaskModel = {
    id: number;
    title: string;
    description: string | null;
    projectId: number;
    createdByUserId: number;
    assignedToUserId: number | null;
    statusId: number;
    createdAt: Date;
    updatedAt: Date;
};


// Task Status

export type TaskStatusModel = {
    id: number;
    name: string;
    position: number;
    projectId: number;
    createdAt: Date;
    updatedAt: Date;
};


// Comment

export type CommentModel = {
    id: number;
    content: string;
    taskId: number;
    createdByUserId: number;
    createdAt: Date;
    updatedAt: Date;
};


// Label

export type LabelModel = {
    id: number;
    name: string;
    projectId: number;
    createdAt: Date;
    updatedAt: Date;
};


// Task Label

export type TaskLabelModel = {
    taskId: number;
    labelId: number;
};


// Attachment

export type AttachmentModel = {
    id: number;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    taskId: number;
    createdByUserId: number;
    createdAt: Date;
    updatedAt: Date;
};


// Audit Log

export type AuditLogModel = {
    id: number;
    action: string;
    entityType: string;
    entityId: number;
    metadata: Record<string, unknown> | null;
    projectId: number;
    createdByUserId: number;
    createdAt: Date;
};


// Notification

export type NotificationModel = {
    id: number;
    type: string;
    message: string;
    isRead: boolean;
    entityType: string;
    entityId: number;
    metadata: Record<string, unknown> | null;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
};
