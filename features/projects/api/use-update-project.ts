import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

//Info: Second way to deal with resp type
type ResponseType = InferResponseType<typeof client.api.projects[":projectId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.projects[":projectId"]["$patch"]>;


export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ form, param }) => {
            const response = await client.api.projects[":projectId"]["$patch"]({ form, param });
            if(!response.ok) {
                throw new Error(JSON.stringify(await response.json()));
            }
            
            return await response.json();
        },
        onSuccess: async ({ data }) => {
            toast.success("Project updated");
            router.refresh();
            await queryClient.invalidateQueries({ queryKey: ["projects"] });
            await queryClient.invalidateQueries({ queryKey: ["project", data.id] });
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