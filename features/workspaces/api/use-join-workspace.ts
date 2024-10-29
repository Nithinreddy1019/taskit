import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type Responsetype = InferResponseType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"]>;


export const useJoinWorkspace = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        Responsetype,
        Error,
        RequestType
    >({
        mutationFn: async ({ param, json }) => {
            const response = await client.api.workspaces[":workspaceId"]["join"]["$post"]({ json, param });

            if(!response.ok) {
                throw new Error(JSON.stringify(await response.json()))
            };

            return await response.json();
        },
        onSuccess: ({data}) => {
            toast.success("joined the workspace");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
        },
        onError: (error) => {
            let errorMsg = "Failed to join workspace";
            if(error.message) {
                const errorData = JSON.parse(error.message);
                errorMsg = errorData.error || errorMsg
            };
            toast.error(errorMsg);
        }
    })


    return mutation;
    
}