import { InferRequestType, InferResponseType} from "hono";


import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["$patch"]>;


export const useUpdateTask = () => {

    const router = useRouter();

    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json, param }) => {
            const response = await client.api.tasks[":taskId"]["$patch"]({ json, param });

            if(!response.ok) {
                throw new Error(JSON.stringify(await response.json()))
            }

            return await response.json();
        },
        onSuccess: async ({ data }) => {
            toast.success("Task updated");

            router.refresh();
            await queryClient.invalidateQueries({ queryKey: ["tasks"] });
            await queryClient.invalidateQueries({ queryKey: ["task", data.id] });
            await queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
            await queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
        },
        onError: (error) => {
            let errorMsg = "Failed to update task";
            if(error.message) {
                const errorData = JSON.parse(error.message);
                errorMsg = errorData.error || errorMsg
            };
            toast.error(errorMsg);
        }
    });

    return mutation;
}