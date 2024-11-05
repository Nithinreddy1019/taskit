
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


import { client } from "@/lib/rpc";


type Responsetype = InferResponseType<typeof client.api.members[":workspaceId"][":userId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.members[":workspaceId"][":userId"]["$patch"]>;

export const useUpdateMember = () => {

    const queryClient = useQueryClient();

    const mutation = useMutation<
        Responsetype,
        Error,
        RequestType    
    >({
        mutationFn: async ({ param, json }) => {
            const response = await client.api.members[":workspaceId"][":userId"]["$patch"]({ param, json })

            if(!response.ok) {
                throw new Error(JSON.stringify(await response.json()))
            };

            return await response.json();
        },
        onSuccess: ({data}) => {
            toast.success("Member updated");
            queryClient.invalidateQueries({ queryKey: ["members"] });
        },
        onError: (error) => {
            let errorMsg = "Failed to update member";
            if(error.message) {
                const errorData = JSON.parse(error.message);
                errorMsg = errorData.error || errorMsg
            };
            toast.error(errorMsg);
        }
    });

    return mutation;
}