"use client"


import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useInviteCode } from "../hooks/use-invite-code";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";


interface JoinWorkspaceFormProps {
    initialValues: {
        name: string,
        imageUrl: string | null | undefined
    }
};

export const JoinWorkspaceForm = ({
    initialValues
}: JoinWorkspaceFormProps) => {

    const router = useRouter();

    const { mutate, isPending } = useJoinWorkspace();
    const invitecode = useInviteCode();
    const workspaceId = useWorkspaceId();

    const onSubmit = () => {
        console.log(invitecode, workspaceId)
        mutate({
            param: { workspaceId },
            json: { code: invitecode}
        }, {
            onSuccess: ({ data }) => {
                router.push(`/workspaces/${data.id}`)
            },
            onError: (error) => {
                if(error.message) {
                    const errorData = JSON.parse(error.message);
                    if(errorData.error === "Already a member") {
                        router.push(`/workspaces/${workspaceId}`)
                    }
                };
            }
        })
    };


    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className={cn("p-6", initialValues.imageUrl !== null && initialValues.imageUrl !== undefined && ("flex flex-row justify-between items-center"))}>
                <div>
                    <CardTitle className="font-bold text-xl">
                        Join workspace
                    </CardTitle>
                    <CardDescription>
                        You&apos;ve have been invited to join <strong>{initialValues.name}</strong> workspace.
                    </CardDescription>
                </div>
                {
                    initialValues.imageUrl && (
                        <div className="rounded-lg relative w-20 h-20 shadow-md">
                            <Image 
                                src={initialValues.imageUrl}
                                alt="workspace logo"
                                fill
                                className="object-cover rounded-lg shadow-sm"
                            />
                        </div>
                    )
                }
            </CardHeader>
            <div className="px-6">
                <DottedSeparator />
            </div>
            <CardContent className="p-6">
                <div className="flex flex-col gap-2 lg:flex-row items-center justify-between lg:justify-start">
                    <Button
                        className="w-full lg:w-fit"
                        asChild
                        variant="secondary"
                        type="button"
                        size="sm"
                        disabled={isPending}
                    >
                        <Link href={"/home"}>
                            Cancel
                        </Link>
                    </Button>
                    <Button
                        className="w-full lg:w-fit"
                        size="sm"
                        type="button"
                        onClick={onSubmit}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <div className="flex items-center">
                                <Loader className="animate-spin size-4 mr-2"/>
                                <p>Joining...</p>
                            </div>
                        ) : "Join workspace"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}