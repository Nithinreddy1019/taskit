import { InferRequestType, InferResponseType} from "hono";


import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


type ResponseType = InferResponseType<typeof client.api.tasks["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.tasks["$post"]>;


export const useCreateTask = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json }) => {
            const response = await client.api.tasks["$post"]({ json });

            if(!response.ok) {
                throw new Error(JSON.stringify(await response.json()))
            }

            return await response.json();
        },
        onSuccess: async () => {
            toast.success("Task created");
            await queryClient.invalidateQueries({ queryKey: ["tasks"] })
        },
        onError: (error) => {
            let errorMsg = "Failed to create task";
            if(error.message) {
                const errorData = JSON.parse(error.message);
                errorMsg = errorData.error || errorMsg
            };
            toast.error(errorMsg);
        }
    });

    return mutation;
}