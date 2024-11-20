import { InferRequestType, InferResponseType} from "hono";


import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


type ResponseType = InferResponseType<typeof client.api.tasks["bulk-update"]["$post"], 200>
type RequestType = InferRequestType<typeof client.api.tasks["bulk-update"]["$post"]>;


export const useBulkUpdateTask = () => {

    const router = useRouter();

    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json }) => {
            const response = await client.api.tasks["bulk-update"]["$post"]({ json });

            if(!response.ok) {
                throw new Error(JSON.stringify(await response.json()))
            }

            return await response.json();
        },
        onSuccess: async ({ data }) => {
            toast.success("Tasks updated");

            router.refresh();
            await queryClient.invalidateQueries({ queryKey: ["tasks"] });
            await queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
            await queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
        },
        onError: (error) => {
            let errorMsg = "Failed to update tasks";
            if(error.message) {
                const errorData = JSON.parse(error.message);
                errorMsg = errorData.error || errorMsg
            };
            toast.error(errorMsg);
        }
    });

    return mutation;
}