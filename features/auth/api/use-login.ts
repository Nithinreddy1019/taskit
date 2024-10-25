import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { DEFAULT_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";

type Responsetype = InferResponseType<typeof client.api.authentication.login["$post"]>;
type RequestType = InferRequestType<typeof client.api.authentication.login["$post"]>["json"];


export const useLogin = () => {
    const mutation = useMutation<
    Responsetype,
    Error,
    RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.authentication.login["$post"]({ json });
            if (!response.ok) {
                throw new Error(JSON.stringify(await response.json()));
            }
            return await response.json();
        },
        onSuccess: async (data, variables) => {
            await signIn("credentials", {
                ...variables,
                redirectTo: DEFAULT_REDIRECT
            })
            toast.success("Login successfull");
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
