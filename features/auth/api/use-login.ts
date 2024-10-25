import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

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
            return await response.json();
        }
    });

    return mutation;
}
