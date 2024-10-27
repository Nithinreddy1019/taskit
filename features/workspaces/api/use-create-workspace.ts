import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.workspaces["$post"]>;
type RequestType = InferRequestType<typeof client.api.workspaces["$post"]>;


export const useCreateWorkspace = () => {

    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ form }) => {
            const response = await client.api.workspaces["$post"]({ form });
            if(!response.ok) {
                throw new Error(JSON.stringify(await response.json()));
            }
            return await response.json();
        },
        onSuccess: async () => {
            toast.success("Workspace created");
            await queryClient.invalidateQueries({ queryKey: ["workspaces"] })
                .then(() => {
                    queryClient.refetchQueries({ queryKey: ["workspaces"] })
                })
        },
        onError: (error) => {
            let errorMsg = "An error occured";
            if(error.message) {
                const errorData = JSON.parse(error.message);
                errorMsg = errorData.error || errorMsg
            };
            toast.error(errorMsg);
        }
    });

    return mutation;
};