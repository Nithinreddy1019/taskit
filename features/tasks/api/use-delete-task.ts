import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


type Responsetype = InferResponseType<typeof client.api.tasks[":taskId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["$delete"]>;


export const useDeleteTask = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<
        Responsetype,
        Error,
        RequestType
    >({
        mutationFn: async ({ param }) => {
            const response = await client.api.tasks[":taskId"]["$delete"]({ param });

            if(!response.ok) {
                throw new Error(JSON.stringify(await response.json()))
            }

            return await response.json();
        },
        onSuccess: async () => {
            toast.success("Task deletd");

            // router.refresh();
            await queryClient.invalidateQueries({ queryKey: ["tasks"] })
        },
        onError: (error) => {
            let errorMsg = "Failed to delete task";
            if(error.message) {
                const errorData = JSON.parse(error.message);
                errorMsg = errorData.error || errorMsg
            };
            toast.error(errorMsg);
        }
    });

    return mutation;
}