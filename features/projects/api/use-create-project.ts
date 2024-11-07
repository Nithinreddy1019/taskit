import { InferRequestType, InferResponseType} from "hono";


import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


type ResponseType = InferResponseType<typeof client.api.projects["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.projects["$post"]>;


export const useCreateProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ form }) => {
            const response = await client.api.projects["$post"]({ form });

            if(!response.ok) {
                throw new Error(JSON.stringify(await response.json()))
            }

            return await response.json();
        },
        onSuccess: async () => {
            toast.success("Project created");
            await queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
        onError: (error) => {
            let errorMsg = "Failed to create project";
            if(error.message) {
                const errorData = JSON.parse(error.message);
                errorMsg = errorData.error || errorMsg
            };
            toast.error(errorMsg);
        }
    });

    return mutation;
}