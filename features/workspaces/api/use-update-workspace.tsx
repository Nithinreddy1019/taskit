import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


import { client } from "@/lib/rpc";

//Info: Second way to deal with resp type
type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["$patch"]>;


export const useUpdateWorkspace = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ form, param }) => {
            const response = await client.api.workspaces[":workspaceId"]["$patch"]({ form, param });
            if(!response.ok) {
                throw new Error(JSON.stringify(await response.json()));
            }
            
            return await response.json();
        },
        onSuccess: async ({ data }) => {
            toast.success("Workspace updated");
            await queryClient.invalidateQueries({ queryKey: ["workspaces"] })
                .then(() => {
                    queryClient.refetchQueries({ queryKey: ["workspaces"] })
                });
            await queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
        },
        onError: (error) => {
            let errorMsg = "An error occured";
            if(error.message) {
                const errorData = JSON.parse(error.message);
                errorMsg = errorData.error || errorMsg
            };
            toast.error(errorMsg);
        }
    })

    return mutation;
}