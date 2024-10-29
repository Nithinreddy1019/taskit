import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type Responsetype = InferResponseType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]>;


export const useResetInviteCode = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        Responsetype,
        Error,
        RequestType
    >({
        mutationFn: async ({ param }) => {
            const response = await client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]({ param });

            if(!response.ok) {
                throw new Error(JSON.stringify(await response.json()))
            };

            return await response.json();
        },
        onSuccess: ({data}) => {
            toast.success("Invite code is reset");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
        },
        onError: (error) => {
            let errorMsg = "Failed to reset invite code";
            if(error.message) {
                const errorData = JSON.parse(error.message);
                errorMsg = errorData.error || errorMsg
            };
            toast.error(errorMsg);
        }
    })


    return mutation;
    
}