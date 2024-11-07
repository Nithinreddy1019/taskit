import { useMutation, useQueryClient } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type Responsetype = InferResponseType<typeof client.api.projects[":projectId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.projects[":projectId"]["$delete"]>;


export const useDeleteProject = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        Responsetype,
        Error,
        RequestType
    >({
        mutationFn: async ({ param }) => {
            const response = await client.api.projects[":projectId"]["$delete"]({ param });

            if(!response.ok) {
                throw new Error(JSON.stringify(await response.json()))
            };

            return await response.json();
        },
        onSuccess: ({data}) => {
            toast.success("Project deleted");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project", data.id] });
        },
        onError: (error) => {
            let errorMsg = "Failed to delete project";
            if(error.message) {
                const errorData = JSON.parse(error.message);
                errorMsg = errorData.error || errorMsg
            };
            toast.error(errorMsg);
        }
    })


    return mutation;
    
}