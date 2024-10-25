import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Responsetype = InferResponseType<typeof client.api.authentication.register["$post"]>;
type RequestType = InferRequestType<typeof client.api.authentication.register["$post"]>["json"];


export const useRegister = () => {

    const router = useRouter();

    const mutation = useMutation<
        Responsetype,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.authentication.register["$post"]({ json });
            if (!response.ok) {
               throw new Error(JSON.stringify(await response.json()));
            }
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account created successfully");
            router.push("/sign-in")
        },
        onError: (error) => {
            let errorMsg = "An error occurred";
            if(error.message){
                const errorData = JSON.parse(error.message);
                errorMsg = errorData.error || errorMsg;
            }
            toast.error(errorMsg)
        }
    });

    return mutation;
}