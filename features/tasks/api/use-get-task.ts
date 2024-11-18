import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { TaskType } from "../types";


interface useGetTaskProps {
    taskId: string
};

type TaskResponse = { 
    error: string; 
} | { 
    data: TaskType | null;
};

export const useGetTask = ({
    taskId
}: useGetTaskProps) => {

    const query = useQuery({
        queryKey: [ "task", taskId ],
        queryFn: async () => {
            const response = await client.api.tasks[":taskId"].$get({ param: { taskId } });

            if(!response.ok) {
                throw new Error("Failed to fetch task")
            }
            

            const result = await response.json() as TaskResponse;

            if ('error' in result) {
                throw new Error(result.error);
            }

            if (!result.data) {
                throw new Error("Task not found");
            }

            return {
                ...result.data,
                dueDate: new Date(result.data.dueDate),
                createdAt: new Date(result.data.createdAt)
            } as TaskType;
        }
    });

    return query;
}



