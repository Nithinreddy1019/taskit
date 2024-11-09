import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { TaskPriority, TaskStatus } from "../types";


interface useGetTasksProps {
    workspaceId: string,
    projectId: string | null,
    assigneeId: string | null,
    status: TaskStatus | null,
    priority: TaskPriority | null,
    search: string | null,
    dueDate: string | null,
};

export const useGetTasks = ({
    workspaceId,
    projectId,
    assigneeId,
    status,
    priority,
    search,
    dueDate
}: useGetTasksProps) => {

    const query = useQuery({
        queryKey: [
            "tasks", 
            workspaceId,
            projectId,
            assigneeId,
            status,
            priority,
            search,
            dueDate
        ],
        queryFn: async () => {
            console.log(workspaceId);
            const response = await client.api.tasks.$get({
                query: { 
                    workspaceId,
                    projectId: projectId ?? undefined,
                    assigneeId: assigneeId ?? undefined,
                    status: status ?? undefined,
                    priority: priority ?? undefined,
                    search: search ?? undefined,
                    dueDate: dueDate ?? undefined          
                }
            });

            if(!response.ok) {
                throw new Error("Failed to fetch tasks")
            }

            const { data } = await response.json();

            return data;
        }
    });

    return query;
}