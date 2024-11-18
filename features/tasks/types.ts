import { $Enums } from "@prisma/client";

export enum TaskStatus {
    BACKLOG = "BACKLOG",
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    IN_REVIEW = "IN_REVIEW",
    DONE = "DONE"
}


export enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    EMERGENCY = "EMERGENCY"
}


export type TaskType = {
    name: string;
    status: TaskStatus | $Enums.Status;
    projectId: string;
    dueDate: Date | string;
    assigneeId: string;
    description: string | null;
    priority: TaskPriority | $Enums.Priority | null;
    id: string;
    createdAt: Date | string;
    position: number;
    workspaceId: string;
    project: {
        id: string,
        name: string,
        image: string | null
    },
    assignee: {
        id: string,
        name: string |  null,
        email: string,
        image: string | null,
    }
}